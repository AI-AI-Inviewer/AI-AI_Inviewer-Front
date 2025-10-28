// src/component/interview/js/Interview.js
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../scss/Interview.scss';

// ✅ /api 프록시 기반 (Vite/CRA 모두 호환)
const API_ROOT = process.env.REACT_APP_API_BASE || '/api';
const GH_TOKEN = process.env.REACT_APP_GH_TOKEN || null;

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

const buildFinalEvalSystemPrompt = (company) => `
당신은 '${company || '미지정'}' 회사의 면접관이자 최종 평가자입니다.
사용자가 제공한 대화록을 바탕으로 최종 점수와 피드백을 작성하세요.

[작성 원칙]
- 한국어로 간결하고 구체적으로.
- 점수는 0~100 정수(반올림).
- 근거는 실제 발언을 짧게 괄호로 인용.
- 실천 가능한 조언을 포함.
- 과장/아부 금지.

[출력 형식]
최종 점수: <숫자>/100
총평: <2~3문장>
세부 점수:
- 자연스러움: <숫자>/100
- 전문성: <숫자>/100
- 논리성: <숫자>/100
잘한 점:
1. ...
2. ...
3. ...
개선점:
1. ...
2. ...
3. ...
합격여부: <합격/보류/불합격> — <한 문장 이유>
다음 준비 과제:
- ...
- ...
`;

const fetchWithTimeout = (url, options, timeout = 15000) =>
    Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), timeout)),
    ]);

const MAX_RESUME_SIZE = 20000;

/** 이름 추출(ko/en 간단 패턴) */
function extractNameFromResume(text) {
    if (!text) return null;

    const m1 = text.match(/(?:^|\n)\s*이름\s*[:：-]\s*([가-힣]{2,4})\s*(?:\n|$)/);
    if (m1) return m1[1];

    const m2 = text.match(/(?:저는\s*)?([가-힣]{2,4})\s*입니다/);
    if (m2) return m2[1];

    const m3 = text.match(/^\s*#\s*([가-힣]{2,4})(?:\s*(?:이력서|resume))?/m);
    if (m3) return m3[1];

    const m4 = text.match(/(?:^|\n)\s*name\s*[:：-]\s*([A-Za-z][A-Za-z.'-]+(?:\s+[A-Za-z.'-]+)*)/i);
    if (m4) return m4[1].trim();

    const firstLine = (text.split('\n')[0] || '').trim();
    const m5 = firstLine.match(/^([가-힣]{2,4})\b/);
    if (m5) return m5[1];

    return null;
}

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
                try {
                    mr.stream.getTracks().forEach((t) => t.stop());
                } catch {}
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
    } catch (e) {
        console.warn('TTS failed:', e);
    }
};

// ===== 질문 태그 추출 =====
function extractQuestion(text) {
    if (!text) return '';

    // 1) 태그 우선: <QUESTION> ... </QUESTION>
    const tag = text.match(/<\s*QUESTION\s*>([\s\S]*?)<\s*\/\s*QUESTION\s*>/i);
    if (tag && tag[1]) {
        let q = tag[1].trim();
        q = q.replace(/^[\s\-–—•\d\.\)\(]+/, ''); // 앞머리 불릿/번호 제거
        if (!/[?？]$/.test(q) && q.length > 0) q += '?';
        return q;
    }

    // 2) 폴백(보수적으로): 전체에서 ?로 끝나는 문장 중 마지막 1개
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const merged = lines.join(' ');
    const parts = merged.split(/(?<=[?？])/).map((s) => s.trim()).filter(Boolean);
    const lastQ = [...parts].reverse().find((s) => /[?？]$/.test(s));
    return lastQ || '';
}

// === 최종 평가용 TTS 요약 추출 ===
function summarizeForTTS(evaluationText) {
    if (!evaluationText) return '';
    const scoreMatch = evaluationText.match(/최종\s*점수\s*[:：]\s*(\d{1,3})/);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

    const totalLineMatch = evaluationText.match(/총평\s*[:：]\s*([^\n]+)/);
    const totalLine = totalLineMatch ? totalLineMatch[1].trim() : '';

    const firstSentence = (totalLine.split(/(?<=[.?!])\s+/)[0] || '').trim();
    return `최종 점수${score !== null ? `는 ${score}점` : ''}입니다. ${firstSentence || '평가 결과를 확인해 주세요.'}`;
}

// === 합격여부 문자열 파싱 (TTS/출력 안전화) ===
function parseDecisionText(recText) {
    const raw = (recText || '').toString().trim();
    if (!raw) return { status: '', reason: '', raw };
    const mStatus = raw.match(/(합격|불합격|보류)/);
    const status = mStatus ? mStatus[1] : '';
    const mReason = raw.match(/[—\-–:]\s*(.+)$/);
    const reason = mReason ? mReason[1].trim() : '';
    return { status, reason, raw };
}

const Interview = () => {
    const location = useLocation();
    const {
        resumeSummary: initSummary = '기본 자기소개서',
        company: companyFromState,
        companyName: companyNameFromState,
    } = location.state || {};
    const company = companyFromState || companyNameFromState || '미지정';

    const [resumeSummary, setResumeSummary] = useState(initSummary);

    // GitHub
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeLoaded, setResumeLoaded] = useState(false);
    const [resumeLoadState, setResumeLoadState] = useState({ loading: false, error: '' });

    // 채팅
    const [chat, setChat] = useState([{ role: 'system', content: buildSystemPrompt(company, resumeSummary) }]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [ended, setEnded] = useState(false); // ✅ 면접 종료 상태

    const controllerRef = useRef(null);
    const bootedRef = useRef(false);

    // 녹음
    const { start: recStart, stop: recStop, recording } = useRecorder();

    // 🔊 보이스 상태
    const [voices, setVoices] = useState([]); // {id, name, preview}
    const PREFERRED_VOICE_NAME = (process.env.REACT_APP_PREFERRED_VOICE_NAME || 'alice').toLowerCase();
    const DEFAULT_VOICE_ID = process.env.REACT_APP_DEFAULT_VOICE_ID || null;
    const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID);
    const [modelId, setModelId] = useState('eleven_flash_v2_5');
    const audioRef = useRef(null);

    // === 자동 스크롤 상태 ===
    const chatBoxRef = useRef(null);
    const stickToBottomRef = useRef(true);
    const scrollToBottom = (smooth = true) => {
        const el = chatBoxRef.current;
        if (!el) return;
        const behavior = smooth ? 'smooth' : 'auto';
        el.scrollTo({ top: el.scrollHeight, behavior });
    };
    const handleChatScroll = () => {
        const el = chatBoxRef.current;
        if (!el) return;
        const threshold = 40; // 하단 40px 이내면 바닥 고정
        const distanceFromBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
        stickToBottomRef.current = distanceFromBottom <= threshold;
    };
    useEffect(() => {
        if (stickToBottomRef.current) {
            requestAnimationFrame(() => scrollToBottom(true));
        }
    }, [chat, loading]);

    useEffect(
        () => () => {
            if (controllerRef.current) controllerRef.current.abort();
            if (audioRef.current) {
                try {
                    audioRef.current.pause();
                    URL.revokeObjectURL(audioRef.current.src);
                } catch {}
            }
        },
        []
    );

    // === 인증 헬퍼 ===
    const getAccessToken = () =>
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwtToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('jwtToken') ||
        null;

    const refreshAccessToken = async () => {
        const res = await fetchWithTimeout(
            `${API_ROOT}/auth/refresh`,
            { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } },
            15000
        );
        if (!res.ok) return null;
        let token = null;
        try {
            const data = await res.json();
            token = data?.accessToken || data?.token || data?.jwt || null;
        } catch {}
        if (!token) {
            const authHeader = res.headers.get('Authorization') || res.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);
        }
        if (token) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('jwtToken', token);
            return token;
        }
        return null;
    };

    const callBackendChat = async (messages) => {
        const controller = new AbortController();
        controllerRef.current = controller;

        let token = getAccessToken();
        if (!token) throw new Error('로그인이 필요합니다. (토큰이 없습니다)');

        const doRequest = (bearer) =>
            fetchWithTimeout(
                `${API_ROOT}/chat`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearer}` },
                    body: JSON.stringify({ messages }),
                    credentials: 'include',
                    signal: controller.signal,
                },
                20000
            );

        let res = await doRequest(token);
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (!newToken) throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
            token = newToken;
            res = await doRequest(token);
        }
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`서버 오류: ${res.status} ${text || res.statusText}`);
        }
        const data = await res.json();
        if (!data || typeof data.reply !== 'string') throw new Error('서버 응답 형식이 올바르지 않습니다.');
        return data.reply;
    };

    // ===== 환영 메시지 빌더 =====
    const buildWelcomeMessage = (opts = {}) => {
        const { companyName = company, personName = null, needResume = !resumeLoaded } = opts;
        const companyDisplay = sanitizeCompanyName(companyName);

        const headline = personName
            ? `안녕하세요 ${personName}님, ${companyDisplay || '미지정'} 회사 면접에 오신 것을 환영합니다.`
            : `안녕하세요! ${companyDisplay || '미지정'} 회사 면접에 오신 것을 환영합니다.`;

        const guideResume = needResume
            ? `- 아직 이력서/깃허브가 연결되지 않았네요. 상단 입력칸에 GitHub 이력서 링크를 불러와 주세요.\n  (예: README.md / resume.md)\n`
            : '';

        return `${headline}
            - 진행 중에는 질문만 제시합니다.
            - 면접 종료 시 최종 평가와 점수표를 제공합니다.
            ${guideResume}
            이제 자기소개를 시작해주세요. 답변을 입력하거나 마이크로 말하면 AI가 다음 질문을 이어갑니다.`;
    };

    // === 초기: 회사명 포함 환영 멘트 (LLM 호출 없음) ===
    useEffect(() => {
        if (bootedRef.current) return;
        bootedRef.current = true;

        (async () => {
            setLoading(true);
            try {
                const selectedId = await loadVoices(); // ← 정렬+선택 완료, 선택 Voice ID 확보
                const welcomeMsg = buildWelcomeMessage();
                setChat((prev) => [...prev, { role: 'assistant', content: welcomeMsg }]);
                await playTts(welcomeMsg, { voiceId: selectedId }); // ← 명시 전달로 레이스 차단
            } catch (e) {
                setChat((prev) => [...prev, { role: 'assistant', content: e?.message || '초기 인사 생성 실패' }]);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadVoices = async () => {
        let token = getAccessToken();
        if (!token) return null;
        const doGet = (bearer) =>
            fetch(`${API_ROOT}/chat/voices`, {
                headers: { Authorization: `Bearer ${bearer}` },
                credentials: 'include',
            });

        let res = await doGet(token);
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (!newToken) return null;
            token = newToken;
            res = await doGet(token);
        }
        if (!res.ok) return null;

        const json = await res.json().catch(async () => {
            const txt = await res.text();
            try {
                return JSON.parse(txt);
            } catch {
                return { voices: [] };
            }
        });
        const raw = Array.isArray(json.voices) ? json.voices : [];

        // 1) ID 고정(환경변수)이 있으면 최우선 → 2) 이름에 'alice' 포함 → 3) 그대로
        const byId = DEFAULT_VOICE_ID ? raw.find((v) => v.voice_id === DEFAULT_VOICE_ID) : null;
        const byName = raw.find((v) => (v.name || '').toLowerCase().includes(PREFERRED_VOICE_NAME));

        let ordered;
        if (byId) {
            ordered = [byId, ...raw.filter((v) => v.voice_id !== byId.voice_id)];
        } else if (byName) {
            ordered = [byName, ...raw.filter((v) => v.voice_id !== byName.voice_id)];
        } else {
            ordered = raw;
        }

        const prepared = ordered.map((v) => ({
            id: v.voice_id,
            name: v.name,
            preview: v.preview_url,
        }));
        setVoices(prepared);

        // 최초 선택: 기존 선택값 없으면 첫 항목으로 고정
        const selected = voiceId ?? (prepared[0]?.id || null);
        setVoiceId(selected);
        return selected; // ★ 호출처에 선택된 보이스 ID 반환
    };

    // === GitHub 자기소개서 불러오기 ===
    const loadResumeFromGithub = async () => {
        const url = resumeUrl.trim();
        if (!url) {
            setResumeLoadState({ loading: false, error: 'URL을 입력해 주세요.' });
            setResumeLoaded(false);
            return;
        }
        setResumeLoadState({ loading: true, error: '' });
        setResumeLoaded(false);

        try {
            let rawUrl = toRawGithubUrl(url);

            let content = '';
            if (rawUrl.includes('api.github.com/repos/') && rawUrl.includes('/contents/')) {
                const res = await fetchWithTimeout(
                    rawUrl,
                    { headers: GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : undefined },
                    15000
                );
                if (!res.ok) throw new Error(`GitHub API 오류: ${res.status}`);
                const json = await res.json();
                if (!json?.content) throw new Error('GitHub API 응답 형식이 올바르지 않습니다.');
                content = atob(json.content.replace(/\n/g, ''));
            } else {
                const res = await fetchWithTimeout(rawUrl, { headers: { Accept: 'text/plain,*/*' } }, 15000);
                if (!res.ok) throw new Error(`가져오기 실패: ${res.status}`);
                content = await res.text();
            }

            let cleaned = content;
            if (cleaned.length > MAX_RESUME_SIZE) {
                cleaned = cleaned.slice(0, MAX_RESUME_SIZE) + '\n\n(요약: 길이 제한으로 일부가 생략되었습니다)';
            }

            // 시스템 프롬프트 갱신
            setResumeSummary(cleaned);
            setChat([{ role: 'system', content: buildSystemPrompt(company, cleaned) }]);

            // ✅ 이름 추출 → 개인화 환영 멘트
            const extractedName = extractNameFromResume(cleaned);
            const welcomeMsg = buildWelcomeMessage({
                companyName: company,
                personName: extractedName,
                needResume: false,
            });

            // 개인화 환영 멘트 출력
            setChat((prev) => [...prev, { role: 'assistant', content: welcomeMsg }]);
            await playTts(welcomeMsg); // 현재 선택된 voiceId 사용

            setResumeLoadState({ loading: false, error: '' });
            setResumeLoaded(true);
        } catch (e) {
            setResumeLoadState({ loading: false, error: e?.message || '불러오기 실패' });
            setResumeLoaded(false);
        }
    };

    // === 전송 ===
    const handleSend = async (overrideText) => {
        if (ended) return; // 종료 후 입력 금지
        const text = (overrideText ?? userInput).trim();
        if (!text || loading) return;

        const updated = [...chat, { role: 'user', content: text }];
        setChat(updated);
        setUserInput('');
        setLoading(true);

        try {
            const reply = await callBackendChat(updated);

            // 질문만 파싱해서 보여주고 읽는다
            const q = extractQuestion(reply);
            setChat((prev) => [
                ...prev,
                { role: 'assistant', content: q || '(질문을 생성하지 못했습니다. 다시 시도하세요.)' }
            ]);

            if (q) {
                await playTts(q);
            }
        } catch (error) {
            setChat((prev) => [...prev, { role: 'assistant', content: error?.message || '오류가 발생했습니다.' }]);
        } finally {
            setLoading(false);
        }
    };

    // === 서버 STT ===
    const sendAudioForStt = async (blob) => {
        let token = getAccessToken();
        if (!token) throw new Error('로그인이 필요합니다. (토큰 없음)');

        const doUpload = (bearer) => {
            const form = new FormData();
            form.append('file', blob, 'voice.webm');
            form.append('language', 'ko');
            return fetch(`${API_ROOT}/chat/stt`, {
                method: 'POST',
                body: form,
                credentials: 'include',
                headers: { Authorization: `Bearer ${bearer}` },
            });
        };

        let res = await doUpload(token);
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (!newToken) throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
            token = newToken;
            res = await doUpload(token);
        }
        if (!res.ok) {
            const msg = await res.text().catch(() => '');
            throw new Error(`STT 실패: ${res.status} ${msg || res.statusText}`);
        }
        const json = await res.json();
        return json.text;
    };

    // === 마이크 ===
    const handleMic = async () => {
        if (ended) return; // 종료 후 입력 금지
        try {
            if (!recording) {
                await recStart();
            } else {
                const blob = await recStop();
                if (!blob) return;
                const text = await sendAudioForStt(blob);
                await handleSend(text);
            }
        } catch (e) {
            setChat((prev) => [
                ...prev,
                { role: 'assistant', content: e?.message || '음성 처리 중 오류가 발생했습니다.' },
            ]);
        }
    };

    // === 서버 TTS ===
    // override: { voiceId?: string, modelId?: string }
    const playTts = async (text, override = {}) => {
        const maxSentences = Number(override.maxSentences ?? 2); // ← 필요시 확장 가능
        const trimmed = String(text).split(/(?<=[?？.!])\s+/).slice(0, maxSentences).join(' ').trim();
        if (!trimmed) return;

        let token = getAccessToken();
        if (!token) {
            speak(trimmed);
            return;
        }

        const payload = {
            text: trimmed,
            voiceId: override.voiceId ?? voiceId,
            modelId: override.modelId ?? modelId,
            stability: 0.4,
            similarityBoost: 0.7,
            outputFormat: 'mp3_44100_128',
        };

        const doCall = (bearer) =>
            fetch(`${API_ROOT}/chat/tts`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${bearer}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

        try {
            let res = await doCall(token);

            if (res.status === 401 || res.status === 403) {
                const newToken = await refreshAccessToken();
                if (!newToken) throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
                res = await doCall(newToken);
            }
            if (!res.ok) {
                const msg = await res.text().catch(() => '');
                throw new Error(`TTS 실패: ${res.status} ${msg}`);
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                try {
                    audioRef.current.pause();
                    URL.revokeObjectURL(audioRef.current.src);
                } catch {}
            }
            audioRef.current = new Audio(url);
            audioRef.current.play().catch((err) => {
                console.warn('Audio play blocked or failed:', err);
                speak(trimmed);
            });
        } catch (e) {
            console.warn('서버 TTS 실패, 브라우저 TTS로 폴백:', e);
            speak(trimmed);
        }
    };

    // === 대화록 문자열 생성 ===
    const buildTranscript = () => {
        return chat
            .filter((m) => m.role !== 'system')
            .map((m) => (m.role === 'user' ? `[후보자] ${m.content}` : `[AI] ${m.content}`))
            .join('\n');
    };

    // === 면접 종료 & 최종 평가 ===
    const handleEndInterview = async () => {
        if (ended) return;
        setLoading(true);

        try {
            // 1) 액세스 토큰 확보
            let token = getAccessToken();
            if (!token) throw new Error('로그인이 필요합니다.');

            // 2) 평가 요청 페이로드
            const payload = {
                company: company || '미지정',
                resumeSummary,
                transcript: buildTranscript(),
            };

            // 3) 호출 함수 (401 시 갱신 후 재시도)
            const doEval = (bearer) =>
                fetch(`${API_ROOT}/chat/eval`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${bearer}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });

            let res = await doEval(token);
            if (res.status === 401) {
                const newToken = await refreshAccessToken();
                if (!newToken) throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
                token = newToken;
                res = await doEval(token);
            }
            if (!res.ok) {
                const msg = await res.text().catch(() => '');
                throw new Error(`평가 실패: ${res.status} ${msg || res.statusText}`);
            }

            // 4) 결과 파싱
            const json = await res.json();
            const sc = json?.score || {};
            const toInt = (v, d = 0) => (typeof v === 'number' ? v : parseInt(String(v || d), 10) || d);

            // 5) 보기 좋게 문자열 구성 ("입니다" 중복 방지)
            const recRaw = (json?.recommendation || '').toString().trim();
            const pretty =
                `최종 점수: ${toInt(sc.총점)}/100\n` +
                `세부 점수:\n` +
                `- 직무적합성: ${toInt(sc.직무적합성)}/25\n` +
                `- 전문성: ${toInt(sc.전문성)}/25\n` +
                `- 인성 및 태도: ${toInt(sc.인성및태도)}/25\n` +
                `- 공직윤리: ${toInt(sc.공직윤리)}/25\n\n` +
                `총평: ${json?.summary || ''}\n` +
                (recRaw ? `합격여부: ${recRaw}\n` : '') +
                (Array.isArray(json?.evidence) && json.evidence.length
                    ? `근거:\n${json.evidence.map((e) => `- ${e}`).join('\n')}`
                    : '');

            // 6) 채팅에 출력
            setChat((prev) => [
                ...prev,
                { role: 'assistant', content: '✅ 면접을 종료합니다. 아래는 최종 평가 결과입니다.' },
                { role: 'assistant', content: pretty },
            ]);

            // 7) 총평 1문장 + 합격여부 1문장 읽어주기 (playTts는 기본 2문장까지만 읽음)
            const rawSummary = (json?.summary || '').toString().trim();
            const summaryFirst = ((rawSummary.split(/(?<=[.?!])\s+/)[0] || rawSummary).trim());

            const { status, reason, raw } = parseDecisionText(recRaw);
            const stripPeriod = (s) => s.replace(/[.。]$/, '');
            const ensurePeriod = (s) => (s ? stripPeriod(s) + '.' : '');

            const s1 = summaryFirst ? `총평: ${ensurePeriod(summaryFirst)}` : '';

            let s2 = '';
            if (status) {
                const statusPhrase = /입니다$/.test(status) ? status : `${status}입니다`;
                s2 = `합격 여부는 ${statusPhrase}${reason ? `, 이유는 ${stripPeriod(reason)}입니다` : ''}.`;
            } else if (raw) {
                s2 = `합격 여부: ${ensurePeriod(raw)}`;
            }

            const ttsLine = [s1, s2].filter(Boolean).join(' ');
            if (ttsLine.trim()) await playTts(ttsLine); // ← 정확히 두 문장 우선 전달

            setEnded(true);
        } catch (e) {
            setChat((prev) => [...prev, { role: 'assistant', content: e?.message || '최종 평가에 실패했습니다.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-interview-container">
            <div className="resume-section">
                <h3>자기소개서 요약</h3>

                {/* GitHub 링크 입력 */}
                <div className="gh-import">
                    <label htmlFor="gh-url">
                        <strong>GitHub 링크</strong> (README.md, resume.md 등)
                    </label>
                    <div className="gh-row">
                        <input
                            id="gh-url"
                            type="url"
                            placeholder="예) https://github.com/user/repo/blob/main/resume.md"
                            value={resumeUrl}
                            onChange={(e) => setResumeUrl(e.target.value)}
                            disabled={resumeLoadState.loading}
                            style={{ flex: 1 }}
                        />
                        <button onClick={loadResumeFromGithub} disabled={resumeLoadState.loading || !resumeUrl.trim()}>
                            {resumeLoadState.loading ? '불러오는 중...' : '불러오기'}
                        </button>
                    </div>

                    {resumeLoaded && !resumeLoadState.error && !resumeLoadState.loading && (
                        <div className="gh-status ok">불러오기 완료</div>
                    )}
                    {resumeLoadState.error && (
                        <div className="error" style={{ color: '#e11d48', marginTop: 6 }}>
                            {resumeLoadState.error}
                        </div>
                    )}
                    <div className="gh-help">
                        공개 Repo의 <code>raw.githubusercontent.com</code> 또는 <code>github.com/.../blob/...</code> 링크를 넣어주세요.
                        사설 Repo는 백엔드 프록시가 필요합니다.
                    </div>
                </div>
            </div>

            <div className="chat-section">
                <h3>AI 면접 시뮬레이션{company ? ` — ${sanitizeCompanyName(company)}` : ''}</h3>

                {/* 🔊 음성/모델 선택 */}
                <div className="voice-row" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <label>
                        <strong>읽어줄 목소리</strong>
                    </label>
                    <select value={voiceId || ''} onChange={(e) => setVoiceId(e.target.value)} disabled={ended}>
                        {voices.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.name} ({v.id.slice(0, 6)}…)
                            </option>
                        ))}
                    </select>

                    <label style={{ marginLeft: 12 }}>
                        <strong>모델</strong>
                    </label>
                    <select value={modelId} onChange={(e) => setModelId(e.target.value)} disabled={ended}>
                        <option value="eleven_flash_v2_5">eleven_flash_v2_5 (권장)</option>
                        <option value="eleven_multilingual_v2">eleven_multilingual_v2</option>
                        <option value="eleven_turbo_v2_5">eleven_turbo_v2_5</option>
                    </select>

                    {/* 미리듣기 */}
                    <button
                        type="button"
                        onClick={() => {
                            const v = voices.find((x) => x.id === voiceId);
                            if (v?.preview) {
                                try {
                                    if (audioRef.current) audioRef.current.pause();
                                    audioRef.current = new Audio(v.preview);
                                    audioRef.current.play().catch((err) => console.warn('Preview play failed:', err));
                                } catch {}
                            }
                        }}
                        disabled={ended}
                    >
                        ▶ 미리듣기
                    </button>
                </div>

                <div className="chat-box" ref={chatBoxRef} onScroll={handleChatScroll}>
                    {chat
                        .filter((m) => m.role !== 'system')
                        .map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role}`}>
                                <strong>{msg.role === 'user' ? '나' : 'AI'}:</strong>{' '}
                                <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                            </div>
                        ))}
                    {loading && (
                        <div className="chat-message assistant typing">
                            <strong>AI:</strong> 응답을 생성 중...
                        </div>
                    )}
                </div>

                <div className="input-area">
          <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={ended ? '면접이 종료되었습니다.' : '답변을 입력하세요 (또는 마이크로 말하기)'}
              disabled={loading || ended}
          />
                    <div className="input-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button onClick={() => handleSend()} disabled={loading || !userInput.trim() || ended}>
                            {loading ? '전송 중...' : '전송'}
                        </button>
                        <button
                            type="button"
                            onClick={handleMic}
                            disabled={loading || ended}
                            title={recording ? '말하기 종료' : '말하기 시작'}
                            className={`btn-mic${recording ? ' recording' : ''}`}
                        >
                            {recording ? '■ 녹음 종료' : '🎤 녹음 시작'}
                        </button>

                        {/* ✅ 면접 종료 버튼 */}
                        <button
                            type="button"
                            onClick={handleEndInterview}
                            disabled={loading || ended}
                            className="btn-end"
                            title="최종 점수와 피드백을 생성합니다"
                            style={{ marginLeft: 'auto' }}
                        >
                            🏁 면접 종료 (점수/피드백)
                        </button>
                    </div>
                    {recording && !ended && <div className="recording-hint">🎤 녹음 중... (버튼을 눌러 종료하세요)</div>}
                    {ended && <div className="recording-hint">✅ 면접이 종료되었습니다. 상단 결과를 확인하세요.</div>}
                </div>
            </div>
        </div>
    );
};

export default Interview;
