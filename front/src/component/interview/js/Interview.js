// src/component/interview/js/Interview.js
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../scss/Interview.scss';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:10000';

/** 공용 fetch 타임아웃 래퍼 */
const fetchWithTimeout = (url, options, timeout = 15000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), timeout)
        ),
    ]);
};

const Interview = () => {
    const location = useLocation();
    const { resumeSummary = '기본 자기소개서', company } = location.state || {};

    const [chat, setChat] = useState([
        {
            role: 'system',
            content: `당신은 면접 전문 AI입니다. 아래 자기소개서 요약과 회사 정보를 바탕으로, 1문 1답 형식으로 대화합니다.
- 회사: ${company || '미지정'}
- 자기소개서 요약:
${resumeSummary}

[응답 형식 규칙]
1) 답변 분석: 자연어처리 시각으로 내용의 강점/약점/근거를 간결히 설명
2) 점수표: 자연스러움/전문성/논리성을 0~100 점수로 제시 (예: 자연스러움 78 / 전문성 82 / 논리성 75)
3) 개선 제안: 구체적으로 2~3가지
4) 다음 꼬리질문 1개 제시
`,
        },
    ]);

    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const controllerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
                console.log('API 요청 중단됨 (페이지 이탈)');
            }
        };
    }, []);

    // ✅ 토큰 읽기: accessToken 우선, 과거 키(jwtToken)도 백업으로
    const getAccessToken = () =>
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwtToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('jwtToken') ||
        null;

    // ✅ 토큰 갱신 (리프레시 쿠키 기반)
    const refreshAccessToken = async () => {
        const res = await fetchWithTimeout(
            `${API_BASE}/api/auth/refresh`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            },
            15000
        );

        if (!res.ok) return null;

        // (A) JSON 본문에서 우선 시도
        let token = null;
        try {
            const data = await res.json();
            token = data?.accessToken || data?.token || data?.jwt || null;
        } catch {
            /* 본문이 없을 수 있음 -> 헤더 체크 */
        }

        // (B) Authorization 헤더에서 시도
        if (!token) {
            const authHeader =
                res.headers.get('Authorization') || res.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }

        if (token) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('jwtToken', token); // 호환 저장
            return token;
        }
        return null;
    };

    // ✅ 보안 유지 버전: Authorization 헤더 포함 + 401 시 1회 리프레시 재시도
    const callBackendChat = async (messages) => {
        const controller = new AbortController();
        controllerRef.current = controller;

        let token = getAccessToken();
        if (!token) {
            throw new Error('로그인이 필요합니다. (토큰이 없습니다)');
        }

        const doRequest = async (bearerToken) =>
            fetchWithTimeout(
                `${API_BASE}/api/chat`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${bearerToken}`,
                    },
                    body: JSON.stringify({ messages }),
                    credentials: 'include', // (선택) 서버에서 쿠키도 함께 쓰는 경우
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
        if (!data || typeof data.reply !== 'string') {
            throw new Error('서버 응답 형식이 올바르지 않습니다.');
        }
        return data.reply;
    };

    const handleSend = async () => {
        if (!userInput.trim() || loading) return;

        const updatedChat = [...chat, { role: 'user', content: userInput.trim() }];
        setChat(updatedChat);
        setUserInput('');
        setLoading(true);

        try {
            const reply = await callBackendChat(updatedChat);
            setChat((prev) => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error(error);
            const message =
                error?.name === 'AbortError'
                    ? '요청이 취소되었습니다.'
                    : error?.message || '오류가 발생했습니다. 다시 시도해 주세요.';
            setChat((prev) => [...prev, { role: 'assistant', content: message }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-interview-container">
            <div className="resume-section">
                <h3>자기소개서 요약</h3>
                <div style={{ whiteSpace: 'pre-wrap' }}>{resumeSummary}</div>
            </div>

            <div className="chat-section">
                <h3>AI 면접 시뮬레이션</h3>

                <div className="chat-box">
                    {chat.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role}`}>
                            <strong>
                                {msg.role === 'user' ? '나' : msg.role === 'assistant' ? 'AI' : '시스템'}:
                            </strong>{' '}
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
