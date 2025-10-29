// src/component/interview/js/VoiceInterview.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../scss/VoiceInterview.scss';
import { createAvatar, destroyAvatar } from '../../../lib/avatarClient';

const API_ROOT = process.env.REACT_APP_API_BASE || '/api';
const GH_TOKEN  = process.env.REACT_APP_GH_TOKEN || null;

/** UI/TTS 표시용: 회사명에서 괄호(… ) 제거 */
const sanitizeCompanyName = (name) =>
    String(name || '')
        .replace(/\s*\([^)]*\)\s*/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

const toRawGithubUrl = (url) => {
    try {
        const u = new URL(url.trim());
        if (u.hostname === 'raw.githubusercontent.com') return u.toString();
        if (u.hostname === 'github.com') {
            const parts = u.pathname.split('/').filter(Boolean);
            const blobIdx = parts.indexOf('blob');
            if (blobIdx !== -1 && parts.length >= blobIdx + 2) {
                const owner = parts[0], repo = parts[1], branch = parts[blobIdx + 1];
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
    } catch { return url; }
};

const getToken = () =>
    localStorage.getItem('accessToken') ||
    localStorage.getItem('jwtToken') ||
    sessionStorage.getItem('accessToken') ||
    sessionStorage.getItem('jwtToken') || null;

const fetchWithTimeout = (url, options, timeout = 20000) =>
    Promise.race([
        fetch(url, options),
        new Promise((_, rej) => setTimeout(() => rej(new Error('요청 시간이 초과되었습니다.')), timeout)),
    ]);

// ============ 간단 녹음 훅 ============
// (동일)
// ============ 간단 녹음 훅 ============
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
        mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
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
    //
};


// ============ 프롬프트 ============
const buildSystemPrompt = (company, resumeSummary) => `
당신은 '${company || '미지정'}' 회사의 면접관입니다.
면접 진행 중에는 오직 **질문만** 하세요. 평가는 면접 종료 시에만 합니다.
- 참고 자료(자기소개서 요약):
${resumeSummary || '기본 자기소개서'}

[규칙]
- 매 턴 질문 1문장만 한국어로 출력(20~100자).
- 분석/점수/조언/서론/불릿/번호/이모지 금지.
- 지원자의 답변이 짧거나 주제에서 벗어나면, 근거를 짧게 판단한 뒤 **다시 초점을 맞추는 질문**을 하되, 출력은 질문 1문장만.
- 다른 텍스트를 출력하지 마세요.

[출력 형식 — 이 줄만 사용]
<QUESTION>여기에 다음 질문 한 문장?</QUESTION>
`;

const extractQuestion = (text) => {
    if (!text) return '';
    const tag = text.match(/<\s*QUESTION\s*>([\s\S]*?)<\s*\/\s*QUESTION\s*>/i);
    if (tag && tag[1]) {
        let q = tag[1].trim();
        q = q.replace(/^[\s\-–—•\d\.\)\(]+/, '');
        if (!/[?？]$/.test(q) && q.length > 0) q += '?';
        return q;
    }
    const merged = text.replace(/\s+/g, ' ');
    const parts = merged.split(/(?<=[?？])/).map((s) => s.trim()).filter(Boolean);
    const lastQ = [...parts].reverse().find((s) => /[?？]$/.test(s));
    return lastQ || '';
};

// ============ 품질 분류(표정/제스처용) ============
const judgeAnswer = (question, answer) => {
    const q = (question || '').toLowerCase();
    const a = (answer || '').toLowerCase();
    if (!a || a.split(/\s+/).length < 8) return 'short';
    const qWords = new Set(q.split(/[^a-z0-9가-힣]+/).filter(Boolean));
    const aWords = new Set(a.split(/[^a-z0-9가-힣]+/).filter(Boolean));
    let overlap = 0; qWords.forEach((w) => { if (aWords.has(w)) overlap++; });
    const jaccard = overlap / (qWords.size + aWords.size - overlap || 1);
    if (jaccard < 0.06) return 'off';
    if (a.length > 200 && jaccard >= 0.12) return 'great';
    return 'ok';
};

const fmt = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const VoiceInterview = () => {
    const location = useLocation();
    const { company: companyFromState, companyName: companyNameFromState } = location.state || {};
    const company = companyFromState || companyNameFromState || '미지정';

    const videoRef = useRef(null);
    const avatarRef = useRef(null);
    const { start: recStart, stop: recStop, recording } = useRecorder();

    // 이력서
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeSummary, setResumeSummary] = useState('기본 자기소개서');
    const [resumeLoaded, setResumeLoaded] = useState(false);
    const [resumeError, setResumeError] = useState('');

    // 대화/상태
    const [chat, setChat] = useState([{ role: 'system', content: buildSystemPrompt(company, '기본 자기소개서') }]);
    const [started, setStarted] = useState(false);
    const [busy, setBusy] = useState(false);
    const [ended, setEnded] = useState(false);

    // 타이머 (5분)
    const [remain, setRemain] = useState(300);
    const timerRef = useRef(null);
    const autoEndRef = useRef(false);

    // 보이스 & 아바타 매핑
    const [voices, setVoices] = useState([]);   // {id,name,preview}
    const [voiceId, setVoiceId] = useState(null);

    const AVATAR_BY_VOICE = useMemo(() => ({
        alice: 'Grace',
        bella: 'Sophia',
        rachel: 'Isabella',
        adam : 'Ethan',
        josh : 'Liam',
        antoni: 'Lucas',
        default: 'Grace',
    }), []);

    const pickAvatarByVoice = (name = '') => {
        const key = Object.keys(AVATAR_BY_VOICE).find(k => k !== 'default' && name.toLowerCase().includes(k));
        return key ? AVATAR_BY_VOICE[key] : AVATAR_BY_VOICE.default;
    };

    // ====== 초기화 (보이스/아바타 세션) ======
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const token = getToken();

                // 보이스 목록
                if (token) {
                    const r = await fetch(`${API_ROOT}/chat/voices`, {
                        headers: { Authorization: `Bearer ${token}` }, credentials: 'include'
                    });
                    const js = await r.json().catch(() => ({ voices: [] }));
                    const list = (Array.isArray(js.voices) ? js.voices : [])
                        .map(v => ({ id: v.voice_id, name: v.name, preview: v.preview_url }));
                    setVoices(list);
                    setVoiceId(list[0]?.id || null);
                }

                // 아바타 토큰
                const at = await fetch(`${API_ROOT}/avatar/token`, {
                    credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : {}
                }).then(r => r.json());

                const clientToken = at?.token ?? at?.data?.token;
                if (!clientToken) throw new Error('아바타 세션 토큰을 받지 못했습니다.');

                // 아바타 시작 (초기 아바타는 기본값)
                const ctrl = await createAvatar({
                    videoEl: videoRef.current,
                    clientToken,
                    avatarName: 'Grace',
                    language: 'ko'
                });
                avatarRef.current = ctrl;

                // 간단 환영 멘트 (표시용/음성은 괄호 제거된 회사명 사용)
                await avatarRef.current?.sayText(
                    `안녕하세요. ${sanitizeCompanyName(company)} AI 면접관입니다. 왼쪽에서 이력서를 불러온 뒤, 오른쪽의 '면접 시작' 버튼을 눌러 진행해 주세요.`
                );
            } catch (e) {
                console.warn('초기화 실패:', e);
            }
        })();
        return () => {
            if (avatarRef.current) { destroyAvatar(avatarRef.current); avatarRef.current = null; }
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ====== Timer 동작: 0초 도달 시 자동 종료(대화 중이면 대기) ======
    useEffect(() => {
        if (!started || ended) return;
        if (remain <= 0) {
            setRemain(0);
            if (!recording && !busy) {
                endInterview();
            } else {
                autoEndRef.current = true;
            }
        }
    }, [remain, started, ended, recording, busy]);

    // 바빠짐/녹음 종료되면 queued auto-end 처리
    useEffect(() => {
        if (autoEndRef.current && !recording && !busy && started && !ended && remain === 0) {
            autoEndRef.current = false;
            endInterview();
        }
    }, [recording, busy, started, ended, remain]);

    // ====== 이력서 불러오기 / 업로드 ======
    const loadResumeFromGithub = async () => {
        const url = resumeUrl.trim();
        if (!url) { setResumeError('URL을 입력해 주세요.'); return; }
        setResumeError('');
        try {
            let rawUrl = toRawGithubUrl(url);
            let content = '';
            if (rawUrl.includes('api.github.com/repos/') && rawUrl.includes('/contents/')) {
                const res = await fetchWithTimeout(rawUrl, { headers: GH_TOKEN ? { Authorization:`Bearer ${GH_TOKEN}` } : undefined }, 15000);
                const json = await res.json();
                content = atob((json?.content || '').replace(/\n/g, ''));
            } else {
                const res = await fetchWithTimeout(rawUrl, { headers: { Accept:'text/plain,*/*' } }, 15000);
                content = await res.text();
            }
            const trimmed = content.slice(0, 20000);
            setResumeSummary(trimmed);
            setResumeLoaded(true);
            setChat([{ role:'system', content: buildSystemPrompt(company, trimmed) }]);
        } catch (e) {
            setResumeError(e?.message || '불러오기 실패');
            setResumeLoaded(false);
        }
    };

    const onUploadFile = async (file) => {
        setResumeError('');
        if (!file) return;
        if (/\.md$|\.txt$/i.test(file.name)) {
            const text = await file.text();
            const trimmed = text.slice(0, 20000);
            setResumeSummary(trimmed);
            setResumeLoaded(true);
            setChat([{ role:'system', content: buildSystemPrompt(company, trimmed) }]);
        } else {
            setResumeError('현재는 .txt / .md만 직접 읽습니다. (docx/pdf는 백엔드 변환 API 권장)');
        }
    };

    // ====== 면접 시작 ======
    const startInterview = async () => {
        if (started) return;
        setStarted(true);
        setRemain(300);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setRemain((s) => Math.max(0, s - 1)), 1000);

        try { avatarRef.current?.emotion?.('happy'); } catch {}
        await avatarRef.current?.sayText('자기소개부터 시작하겠습니다. 준비가 되시면 말씀해 주세요.');
    };

    // ====== 말하기(녹음→STT→질문 생성→아바타 발화) ======
    const handleSpeak = async () => {
        if (!started || ended || busy) return;
        try {
            if (!recording) {
                await recStart();
            } else {
                setBusy(true);
                const blob = await recStop();
                if (!blob) { setBusy(false); return; }

                // 1) STT
                const token = getToken();
                const form = new FormData();
                form.append('file', blob, 'voice.webm');
                form.append('language', 'ko');
                let res = await fetch(`${API_ROOT}/chat/stt`, { method:'POST', body:form, credentials:'include', headers:{ Authorization:`Bearer ${token}` }});
                if (!res.ok) throw new Error('STT 실패');
                const { text } = await res.json();
                setChat((prev)=>[...prev, { role:'user', content:text }]);

                // 2) 질문 생성
                const payload = { messages: [...chat, { role:'user', content:text }] };
                res = await fetch(`${API_ROOT}/chat`, {
                    method:'POST', credentials:'include',
                    headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('질문 생성 실패');
                const js = await res.json();
                const q = extractQuestion(js?.reply || '');

                // 3) 표정/제스처
                const lastQ = [...chat].reverse().find(m => m.role==='assistant')?.content || '';
                const quality = judgeAnswer(lastQ, text);
                if (quality === 'short' || quality === 'off') {
                    avatarRef.current?.emotion?.('sad');
                } else if (quality === 'great') {
                    avatarRef.current?.emotion?.('happy');
                    avatarRef.current?.gesture?.('nod');
                } else {
                    avatarRef.current?.emotion?.('neutral');
                }

                // 4) 아바타 발화(텍스트만)
                const speech = q || '다시 한 번 자세히 말씀해 주시겠어요?';
                setChat((prev)=>[...prev, { role:'assistant', content:speech }]);
                await avatarRef.current?.sayText(speech);
            }
        } catch (e) {
            console.warn(e);
        } finally {
            setBusy(false);
        }
    };

    // ====== 수동/자동 종료 공통 ======
    const endInterview = async () => {
        if (ended) return;
        setEnded(true);
        if (timerRef.current) clearInterval(timerRef.current);

        try {
            avatarRef.current?.emotion?.('happy');
            await avatarRef.current?.sayText('수고하셨습니다. 면접을 종료하고 평가 결과를 보여드리겠습니다.');

            const token = getToken();
            const transcript = chat
                .filter((m)=>m.role!=='system')
                .map((m)=> m.role==='user' ? `[후보자] ${m.content}` : `[AI] ${m.content}`).join('\n');

            const payload = { company, resumeSummary, transcript };
            const res = await fetch(`${API_ROOT}/chat/eval`, {
                method:'POST', credentials:'include',
                headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('평가 실패');
            const json = await res.json();

            const sc = json?.score || {};
            const toI = (v, d=0)=> (typeof v==='number'? v : parseInt(v||d,10)||d);
            const pretty =
                `최종 점수: ${toI(sc.총점)}/100\n`+
                `세부 점수:\n`+
                `- 직무적합성: ${toI(sc.직무적합성)}/25\n`+
                `- 전문성: ${toI(sc.전문성)}/25\n`+
                `- 인성 및 태도: ${toI(sc.인성및태도)}/25\n`+
                `- 공직윤리: ${toI(sc.공직윤리)}/25\n\n`+
                `총평: ${json?.summary || ''}\n`+
                (json?.recommendation ? `합격여부: ${json.recommendation}\n` : '')+
                (Array.isArray(json?.evidence)&&json.evidence.length ? `근거:\n${json.evidence.map(e=>`- ${e}`).join('\n')}` : '');

            setChat((prev)=>[...prev,
                { role:'assistant', content:'✅ 면접이 종료되었습니다. 아래에서 대화 기록과 점수표를 확인하세요.' },
                { role:'assistant', content: pretty },
            ]);
        } catch (e) {
            setChat((p)=>[...p, { role:'assistant', content: e?.message || '최종 평가 생성 실패' }]);
        }
    };

    // ====== 아바타/보이스 변경 ======
    const onChangeVoice = (id) => {
        setVoiceId(id);
        const vName = voices.find(v => v.id === id)?.name || '';
        avatarRef.current?.switchAvatar?.(pickAvatarByVoice(vName));
    };

    return (
        <div className="vi-grid">
            {/* 좌 — 이력서 영역 */}
            <aside className="vi-left">
                <h3>이력서 준비</h3>

                <div className="vi-card">
                    <label className="label">GitHub 링크</label>
                    <div className="row">
                        <input
                            type="url"
                            placeholder="예) https://github.com/user/repo/blob/main/resume.md"
                            value={resumeUrl}
                            onChange={(e)=>setResumeUrl(e.target.value)}
                        />
                        <button onClick={loadResumeFromGithub}>불러오기</button>
                    </div>

                    <div className="or">또는</div>

                    <label className="label">이력서 파일(.txt/.md)</label>
                    <input type="file" accept=".txt,.md" onChange={(e)=>onUploadFile(e.target.files?.[0]||null)} />

                    {resumeLoaded && <div className="ok">불러오기 완료</div>}
                    {resumeError  && <div className="err">{resumeError}</div>}
                </div>
            </aside>

            {/* 중앙 상단 — 아바타 스테이지 */}
            <section className="vi-stage">
                <div className="stage-inner">
                    <video ref={videoRef} autoPlay playsInline />
                </div>
            </section>

            {/* 중앙 하단 — 대화 로그 */}
            <section className="vi-chat">
                <h3>대화 기록</h3>
                <div className="log">
                    {chat.filter(m=>m.role!=='system').map((m,i)=>(
                        <div key={i} className={`msg ${m.role}`}>
                            <strong>{m.role==='user' ? '나' : 'AI'}:</strong>{' '}
                            <span style={{ whiteSpace:'pre-wrap' }}>{m.content}</span>
                        </div>
                    ))}
                    {(busy || recording) && <div className="msg assistant">진행 중…</div>}
                </div>
            </section>

            {/* 우 — 컨트롤 & 타이머 */}
            <aside className="vi-right">
                <h3>컨트롤</h3>
                <div className="vi-card">
                    <div className="timer">
                        <div className={`time ${remain <= 10 ? 'warn' : ''}`}>{fmt(remain)}</div>
                        <div className="bar">
                            <div
                                className="fill"
                                style={{ width: `${(remain/300)*100}%` }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <label>아바타</label>
                        <select value={voiceId || ''} onChange={(e)=>onChangeVoice(e.target.value)}>
                            {voices.map(v => (<option key={v.id} value={v.id}>{v.name}</option>))}
                        </select>
                    </div>

                    <div className="row buttons">
                        <button className="primary" disabled={started||ended} onClick={startInterview}>
                            ▶ 면접 시작
                        </button>
                        <button className={`mic ${recording ? 'rec' : ''}`} disabled={!started||ended||busy} onClick={handleSpeak}>
                            {recording ? '■ 말하기 종료' : '🎤 말하기 시작'}
                        </button>
                        <button className="danger" disabled={!started||ended||busy} onClick={endInterview}>
                            🏁 면접 종료
                        </button>
                    </div>

                    <div className="hint">
                        * 타이머(5분)가 0이 되면 대화가 끝나는 시점에 자동 종료됩니다.
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default VoiceInterview;
