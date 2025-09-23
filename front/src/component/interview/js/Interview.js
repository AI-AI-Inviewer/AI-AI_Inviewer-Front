// src/component/interview/js/Interview.js
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../scss/Interview.scss';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:10002';
const GH_TOKEN = process.env.REACT_APP_GH_TOKEN || null;

const toRawGithubUrl = (url) => {
    try {
        const u = new URL(url.trim());
        if (u.hostname === 'raw.githubusercontent.com') return u.toString();
        if (u.hostname === 'github.com') {
            const parts = u.pathname.split('/').filter(Boolean);
            const blobIdx = parts.indexOf('blob');
            if (blobIdx !== -1 && parts.length >= blobIdx + 2) {
                const owner = parts[0];
                const repo = parts[1];
                const branch = parts[blobIdx + 1];
                const path = parts.slice(blobIdx + 2).join('/');
                return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
            }
        }
        if (u.hostname === 'gist.github.com') {
            const parts = u.pathname.split('/').filter(Boolean);
            const gistId = parts[1];
            if (gistId) return `https://gist.githubusercontent.com/${parts[0]}/${gistId}/raw`;
        }
        return url;
    } catch {
        return url;
    }
};

const buildSystemPrompt = (company, resumeSummary) => `
당신은 '${company || '미지정'}' 회사의 면접관입니다.
아래 자기소개서 요약을 참고해 1문1답으로 진행하세요.

- 자기소개서 요약:
${resumeSummary || '기본 자기소개서'}

[응답 형식]
1) 답변 분석(강점/약점/근거)
2) 점수표(자연스러움/전문성/논리성, 0~100)
3) 개선 제안(2~3가지)
4) 다음 꼬리질문 1개
`;

const fetchWithTimeout = (url, options, timeout = 15000) =>
    Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), timeout)),
    ]);

const MAX_RESUME_SIZE = 20000;

// ===== 간단 녹음 훅 =====
const useRecorder = () => {
    const mediaRef = useRef(null);
    const chunksRef = useRef([]);
    const [recording, setRecording] = useState(false);

    const start = async () => {
        if (recording) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : 'audio/webm';
        const mr = new MediaRecorder(stream, { mimeType });
        mediaRef.current = mr;
        chunksRef.current = [];
        mr.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
        };
        mr.onstop = () => setRecording(false);
        mr.start();
        setRecording(true);
    };

    const stop = async () => {
        if (!mediaRef.current) return null;
        const mr = mediaRef.current;
        return new Promise((resolve) => {
            mr.onstop = () => {
                setRecording(false);
                const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
                try { mr.stream.getTracks().forEach((t) => t.stop()); } catch {}
                resolve(blob);
            };
            mr.stop();
        });
    };

    return { start, stop, recording };
};

// ===== 브라우저 폴백 TTS =====
const speak = (text, { lang = 'ko-KR' } = {}) => {
    try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        const voices = window.speechSynthesis?.getVoices?.() || [];
        const ko = voices.find((v) => v.lang?.toLowerCase().startsWith('ko'));
        if (ko) u.voice = ko;
        window.speechSynthesis.speak(u);
    } catch (e) { console.warn('TTS failed:', e); }
};

// ===== 꼬리질문 추출 =====
function extractFollowUpQuestion(text) {
    if (!text) return '';
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const p1 = lines.find((l) => /^4\)\s*/.test(l) || /^다음\s*꼬리질문/i.test(l) || /^follow[\s-]*up/i.test(l));
    if (p1) {
        let q = p1.replace(/^4\)\s*/, '').replace(/^다음\s*꼬리질문[^:]*:\s*/i, '').replace(/^follow[\s-]*up[^:]*:\s*/i, '').trim();
        if (!/[?？]$/.test(q) && q.length > 0) q += '?';
        return q;
    }
    const bulletQ = lines.find((l) => /[?？]$/.test(l));
    if (bulletQ) return bulletQ;
    const merged = lines.join(' ');
    const parts = merged.split(/(?<=[?？])/).map((s) => s.trim()).filter(Boolean);
    return parts.find((s) => /[?？]$/.test(s)) || '';
}

const Interview = () => {
    const location = useLocation();
    const { resumeSummary: initSummary = '기본 자기소개서', company } = location.state || {};

    const [resumeSummary, setResumeSummary] = useState(initSummary);
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeLoaded, setResumeLoaded] = useState(false);
    const [resumeLoadState, setResumeLoadState] = useState({ loading: false, error: '' });

    const [chat, setChat] = useState([{ role: 'system', content: buildSystemPrompt(company, resumeSummary) }]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const controllerRef = useRef(null);
    const bootedRef = useRef(false);
    const audioRef = useRef(null);

    const { start: recStart, stop: recStop, recording } = useRecorder();

    const [voices, setVoices] = useState([]);
    const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM');
    const [modelId, setModelId] = useState('eleven_flash_v2_5');

    useEffect(() => () => {
        if (controllerRef.current) controllerRef.current.abort();
        if (audioRef.current) {
            try { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); } catch {}
        }
    }, []);

    const getAccessToken = () =>
        localStorage.getItem('accessToken') || localStorage.getItem('jwtToken') || sessionStorage.getItem('accessToken') || sessionStorage.getItem('jwtToken') || null;

    const refreshAccessToken = async () => {
        const res = await fetchWithTimeout(`${API_BASE}/api/auth/refresh`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } }, 15000);
        if (!res.ok) return null;
        let token = null;
        try { const data = await res.json(); token = data?.accessToken || data?.token || data?.jwt || null; } catch {}
        if (!token) {
            const authHeader = res.headers.get('Authorization') || res.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);
        }
        if (token) { localStorage.setItem('accessToken', token); localStorage.setItem('jwtToken', token); return token; }
        return null;
    };

    const callBackendChat = async (messages) => {
        const controller = new AbortController();
        controllerRef.current = controller;
        let token = getAccessToken();
        if (!token) throw new Error('로그인이 필요합니다. (토큰이 없습니다)');
        const doRequest = (bearer) => fetchWithTimeout(`${API_BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearer}` }, body: JSON.stringify({ messages }), credentials: 'include', signal: controller.signal }, 20000);
        let res = await doRequest(token);
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (!newToken) throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
            token = newToken; res = await doRequest(token);
        }
        if (!res.ok) { const text = await res.text().catch(() => ''); throw new Error(`서버 오류: ${res.status} ${text || res.statusText}`); }
        const data = await res.json();
        if (!data || typeof data.reply !== 'string') throw new Error('서버 응답 형식이 올바르지 않습니다.');
        return data.reply;
    };

    // ===== 초기 인사 & 보이스 목록 =====
    useEffect(() => {
        if (bootedRef.current) return;
        bootedRef.current = true;
        (async () => {
            setLoading(true);
            try {
                await loadVoices();
                const kickoff = [
                    { role: 'system', content: buildSystemPrompt(company, resumeSummary) },
                    { role: 'user', content: '면접을 시작해 주세요. 먼저 인사하고 자기소개를 요청해 주세요.' },
                ];
                const reply = await callBackendChat(kickoff);
                setChat((prev) => [...prev, { role: 'assistant', content: reply }]);
                const q1 = extractFollowUpQuestion(reply) || (reply.replace(/\s+/g, ' ').trim().split(/(?<=[?？])/).find((s) => /[?？]$/.test(s)) || '').trim();
                if (q1) await playTts(q1);
            } catch (e) { setChat((prev) => [...prev, { role: 'assistant', content: e?.message || '초기 인사 생성 실패' }]); }
            finally { setLoading(false); }
        })();
    }, []);

    const loadVoices = async () => {
        let token = getAccessToken();
        if (!token) return;
        const doGet = (bearer) => fetch(`${API_BASE}/api/chat/voices`, { headers: { Authorization: `Bearer ${bearer}` }, credentials: 'include' });
        let res = await doGet(token);
        if (res.status === 401) { const newToken = await refreshAccessToken(); if (!newToken) return; token = newToken; res = await doGet(token); }
        if (!res.ok) return;
        const json = await res.json().catch(async () => { const txt = await res.text(); try { return JSON.parse(txt); } catch { return { voices: [] }; } });
        const list = Array.isArray(json.voices) ? json.voices : [];
        setVoices(list.map((v) => ({ id: v.voice_id, name: v.name, preview: v.preview_url })));
        if (list.length > 0 && !list.find((v) => v.voice_id === voiceId)) setVoiceId(list[0].voice_id);
    };

    const loadResumeFromGithub = async () => {
        const url = toRawGithubUrl(resumeUrl);
        if (!url) return setResumeLoadState({ loading: false, error: 'URL이 유효하지 않습니다.' });
        setResumeLoadState({ loading: true, error: '' });
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('파일을 가져올 수 없습니다.');
            let text = await res.text();
            if (text.length > MAX_RESUME_SIZE) text = text.slice(0, MAX_RESUME_SIZE);
            setResumeSummary(text);
            setResumeLoaded(true);
            setResumeLoadState({ loading: false, error: '' });
        } catch (e) { setResumeLoadState({ loading: false, error: e.message || '가져오기 실패' }); }
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return;
        const msg = userInput.trim();
        setChat((prev) => [...prev, { role: 'user', content: msg }]);
        setUserInput('');
        setLoading(true);
        try {
            const updatedChat = [...chat, { role: 'user', content: msg }];
            const reply = await callBackendChat(updatedChat);
            setChat((prev) => [...prev, { role: 'assistant', content: reply }]);
            const q = extractFollowUpQuestion(reply);
            if (q) await playTts(q);
        } catch (e) {
            setChat((prev) => [...prev, { role: 'assistant', content: e?.message || '응답 생성 실패' }]);
        } finally { setLoading(false); }
    };

    const playTts = async (text) => {
        if (!text) return;
        if (!voiceId || !modelId) return speak(text);
        try {
            const controller = new AbortController();
            audioRef.current?.pause();
            audioRef.current = null;
            const token = getAccessToken();
            const res = await fetch(`${API_BASE}/api/chat/tts`, {
                method: 'POST',
                body: JSON.stringify({ text, voiceId, modelId }),
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                signal: controller.signal,
            });
            if (!res.ok) throw new Error('TTS 생성 실패');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.play();
        } catch (e) { console.warn('TTS 실패:', e); speak(text); }
    };

    return (
        <div className="ai-interview-container">
            <div className="resume-section">
                <h3>자기소개서</h3>
                <div>{resumeSummary}</div>
                <div className="gh-import">
                    <label>GitHub/Gist URL</label>
                    <div className="gh-row">
                        <input type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://github.com/..." />
                        <button disabled={resumeLoadState.loading || !resumeUrl} onClick={loadResumeFromGithub}>
                            {resumeLoadState.loading ? '불러오는 중...' : '불러오기'}
                        </button>
                    </div>
                    {resumeLoadState.error && <div className="gh-status err">{resumeLoadState.error}</div>}
                    {resumeLoaded && <div className="gh-status ok">성공적으로 불러왔습니다.</div>}
                </div>
            </div>
            <div className="chat-section">
                <h3>면접 채팅</h3>
                <div className="chat-box">
                    {chat.filter(c => c.role !== 'system').map((c, idx) => (
                        <div key={idx} className={`chat-message ${c.role}`}>
                            <strong>{c.role === 'user' ? '나' : 'AI 면접관'}</strong>
                            <span>{c.content}</span>
                        </div>
                    ))}
                    {loading && <div className="chat-message typing">입력 처리 중...</div>}
                </div>
                <div className="input-area">
                    <textarea rows={2} value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="답변을 입력하세요..." />
                    <div className="input-actions">
                        <button onClick={sendMessage} disabled={loading || !userInput.trim()}>전송</button>
                        <button className={`btn-mic ${recording ? 'recording' : ''}`} onClick={async () => { if (!recording) await recStart(); else { const blob = await recStop(); if (!blob) return; const text = '[오디오 입력 처리 필요]'; setUserInput((prev) => prev + ' ' + text); } }}>
                            {recording ? '녹음 중...' : '마이크'}
                        </button>
                    </div>
                    {recording && <div className="recording-hint">말씀을 마친 뒤 버튼을 눌러 녹음을 종료하세요.</div>}
                </div>
            </div>
        </div>
    );
};

export default Interview;
