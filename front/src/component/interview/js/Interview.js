import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../scss/Interview.scss';

const API_KEYS = [
    ''
];

// fetch 타임아웃 적용
const fetchWithTimeout = (url, options, timeout = 15000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), timeout)
        )
    ]);
};

const Interview = () => {
    const location = useLocation();
    const { resumeSummary = "기본 자기소개서", company } = location.state || {};

    const [resumeText] = useState(resumeSummary);
    const [chat, setChat] = useState([
        {
            role: 'system',
            content: `AI 면접관입니다. ${company || ''} 회사 자기소개서를 기반으로 질문을 드립니다.

답변 시 아래를 반드시 포함하세요:

1) 자연어처리 기법으로 답변 분석 및 피드백
2) 자연스러움, 전문성, 논리성 등 기준으로 0~100 점수화
3) 개선할 점 구체적 제안`
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    // API 요청 취소용 컨트롤러 ref
    const controllerRef = useRef(null);

    // 컴포넌트 언마운트 시 요청 중단
    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
                console.log("API 요청 중단됨 (페이지 나감)");
            }
        };
    }, []);

    // API 호출 (지수 백오프 + 키 순환 + AbortController)
    const callOpenAI = async (messages, attempt = 0) => {
        const MAX_ATTEMPTS = API_KEYS.length * 5; // 재시도 횟수 늘림
        const keyIndex = attempt % API_KEYS.length;

        if (attempt >= MAX_ATTEMPTS) {
            throw new Error('모든 API 키가 제한 상태이거나 오류가 발생했습니다.');
        }

        console.log(`Attempt #${attempt + 1} with API Key index: ${keyIndex}`);

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const response = await fetchWithTimeout('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEYS[keyIndex]}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages,
                    temperature: 0.7,
                }),
                signal: controller.signal,
            });

            if (response.status === 429) {
                const delay = Math.min(60000, 1000 * Math.pow(2, attempt)); // 최대 60초까지 지연
                console.warn(`429 오류 - ${delay / 1000}s 후 재시도`);
                await new Promise(r => setTimeout(r, delay));
                return await callOpenAI(messages, attempt + 1);
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 오류: ${response.status} ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('API 요청이 중단되었습니다.');
                throw new Error('요청이 취소되었습니다.');
            }

            console.warn(`API 호출 실패 (attempt ${attempt + 1}):`, error.message);
            const delay = 500 * (attempt + 1);
            await new Promise(r => setTimeout(r, delay));
            return await callOpenAI(messages, attempt + 1);
        }
    };

    const handleSend = async () => {
        if (!userInput.trim() || loading) return;

        const updatedChat = [...chat, { role: 'user', content: userInput }];
        setChat(updatedChat);
        setUserInput('');
        setLoading(true);

        try {
            const data = await callOpenAI(updatedChat);

            if (data.choices && data.choices.length > 0) {
                const reply = data.choices[0].message.content;
                setChat([...updatedChat, { role: 'assistant', content: reply }]);
            } else {
                setChat([...updatedChat, { role: 'assistant', content: 'AI 응답이 없습니다.' }]);
            }
        } catch (error) {
            console.error(error);
            setChat(prev => [
                ...prev,
                { role: 'assistant', content: error.message || '오류가 발생했습니다. 다시 시도해 주세요.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-interview-container">
            <div className="resume-section">
                <h3>자기소개서 요약</h3>
                <div style={{ whiteSpace: 'pre-wrap' }}>{resumeText}</div>
            </div>

            <div className="chat-section">
                <h3>AI 면접 시뮬레이션</h3>
                <div className="chat-box">
                    {chat.map((msg, index) => (
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
