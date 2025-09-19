// src/component/interview/js/Interview.js
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../scss/Interview.scss';

// const isAbortError = (e) =>
//     e?.name === 'AbortError' || String(e?.message || '').toLowerCase().includes('abort');
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:10000';
const GH_TOKEN = process.env.REACT_APP_GH_TOKEN || null; // 프론트 노출 위험. 가능하면 백엔드 프록시 권장.

// ===== 유틸: GitHub URL → raw URL 변환 =====
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
            const parts = u.pathname.split('/').filter(Boolean); // ["owner","gistId"]
            const gistId = parts[1];
            if (gistId) return `https://gist.githubusercontent.com/${parts[0]}/${gistId}/raw`;
        }

        return url;
    } catch {
        return url;
    }
};

// ===== 프롬프트 빌더 =====
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

// ===== fetch 타임아웃 래퍼 =====
const fetchWithTimeout = (url, options, timeout = 15000) =>
    Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), timeout)
        ),
    ]);

const MAX_RESUME_SIZE = 20000; // 20kB 초과시 컷

const Interview = () => {
    const location = useLocation();
    const { resumeSummary: initSummary = '기본 자기소개서', company } = location.state || {};

    // 프롬프트용 요약(화면에는 절대 표시하지 않음)
    const [resumeSummary, setResumeSummary] = useState(initSummary);

    // GitHub 입력/상태
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeLoaded, setResumeLoaded] = useState(false);
    const [resumeLoadState, setResumeLoadState] = useState({ loading: false, error: '' });

    // 채팅
    const [chat, setChat] = useState([{ role: 'system', content: buildSystemPrompt(company, resumeSummary) }]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const controllerRef = useRef(null);
    const bootedRef = useRef(false);

    useEffect(() => {
        return () => {
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    // === 인증 헬퍼 ===
    const getAccessToken = () =>
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwtToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('jwtToken') ||
        null;

    const refreshAccessToken = async () => {
        const res = await fetchWithTimeout(
            `${API_BASE}/api/auth/refresh`,
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
                `${API_BASE}/api/chat`,
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

    // === 초기: AI 인사 ===
    useEffect(() => {
        if (bootedRef.current) return;
        bootedRef.current = true;

        (async () => {
            setLoading(true);
            try {
                const kickoff = [
                    { role: 'system', content: buildSystemPrompt(company, resumeSummary) },
                    { role: 'user', content: '면접을 시작해 주세요. 먼저 인사하고 자기소개를 요청해 주세요.' },
                ];
                const reply = await callBackendChat(kickoff);
                setChat((prev) => [...prev, { role: 'assistant', content: reply }]);
            } catch (e) {
                setChat((prev) => [...prev, { role: 'assistant', content: e?.message || '초기 인사 생성 실패' }]);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // === GitHub에서 자기소개서 불러오기 (내용은 화면에 표시하지 않음) ===
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
                const res = await fetchWithTimeout(
                    rawUrl,
                    { headers: { Accept: 'text/plain,*/*' } },
                    15000
                );
                if (!res.ok) throw new Error(`가져오기 실패: ${res.status}`);
                content = await res.text();
            }

            let cleaned = content;
            if (cleaned.length > MAX_RESUME_SIZE) {
                cleaned = cleaned.slice(0, MAX_RESUME_SIZE) + '\n\n(요약: 길이 제한으로 일부가 생략되었습니다)';
            }

            // 프롬프트용 요약만 갱신 (UI에는 표시하지 않음)
            setResumeSummary(cleaned);

            // 면접 재시작: system만 교체하고 기록 초기화
            setChat([{ role: 'system', content: buildSystemPrompt(company, cleaned) }]);

            // 자동 인사
            setLoading(true);
            try {
                const kickoff = [
                    { role: 'system', content: buildSystemPrompt(company, cleaned) },
                    { role: 'user', content: '면접을 시작해 주세요. 먼저 인사하고 자기소개를 요청해 주세요.' },
                ];
                const reply = await callBackendChat(kickoff);
                setChat((prev) => [...prev, { role: 'assistant', content: reply }]);
            } catch (e) {
                setChat((prev) => [...prev, { role: 'assistant', content: e?.message || '초기 인사 생성 실패' }]);
            } finally {
                setLoading(false);
            }

            setResumeLoadState({ loading: false, error: '' });
            setResumeLoaded(true); // ✅ 화면에는 완료 메시지만
        } catch (e) {
            setResumeLoadState({ loading: false, error: e?.message || '불러오기 실패' });
            setResumeLoaded(false);
        }
    };

    // === 전송 ===
    const handleSend = async () => {
        if (!userInput.trim() || loading) return;
        const updated = [...chat, { role: 'user', content: userInput.trim() }];
        setChat(updated);
        setUserInput('');
        setLoading(true);

        try {
            const reply = await callBackendChat(updated);
            setChat((prev) => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            setChat((prev) => [...prev, { role: 'assistant', content: error?.message || '오류가 발생했습니다.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-interview-container">
            <div className="resume-section">
                <h3>자기소개서 요약</h3>

                {/* GitHub 링크 입력 + 불러오기 */}
                <div className="gh-import">
                    <label htmlFor="gh-url"><strong>GitHub 링크</strong> (README.md, resume.md 등)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
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

                    {/* 상태만 보여주기 (내용은 표시 안 함) */}
                    {resumeLoaded && !resumeLoadState.error && !resumeLoadState.loading && (
                        <div style={{ marginTop: 10, color: '#16a34a', fontWeight: 600 }}>
                            불러오기 완료 ✅
                        </div>
                    )}
                    {resumeLoadState.error && (
                        <div className="error" style={{ color: '#e11d48', marginTop: 6 }}>
                            {resumeLoadState.error}
                        </div>
                    )}
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                        공개 Repo의 <code>raw.githubusercontent.com</code> 또는 <code>github.com/.../blob/...</code> 링크를 넣어주세요.
                        사설 Repo는 백엔드 프록시가 필요합니다.
                    </div>
                </div>
                {/* ✅ 더 이상 resumeSummary를 화면에 렌더링하지 않음 */}
            </div>

            <div className="chat-section">
                <h3>AI 면접 시뮬레이션{company ? ` — ${company}` : ''}</h3>

                <div className="chat-box">
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
              placeholder="답변을 입력하세요"
              disabled={loading}
          />
                    <button onClick={handleSend} disabled={loading || !userInput.trim()}>
                        {loading ? '전송 중...' : '전송'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Interview;
