import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../scss/Interview.scss';

const Interview = () => {
    const location = useLocation();
    const { resumeSummary = "기본 자기소개서", company } = location.state || {};

    const [resumeText, setResumeText] = useState(resumeSummary);
    const [chat, setChat] = useState([
        { role: 'system', content: `AI 면접관입니다. ${company || ''} 회사 자기소개서를 기반으로 질문을 드립니다.` }
    ]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const updatedChat = [...chat, { role: 'user', content: userInput }];
        setChat(updatedChat);
        setUserInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: `다음 자기소개서를 참고하여 면접 질문을 해주세요: ${resumeText}` },
                        ...updatedChat
                    ]
                })
            });

            const data = await response.json();
            setChat([...updatedChat, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            setChat([...updatedChat, { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-interview-container">
            <div className="resume-section">
                <h3>자기소개서 요약</h3>
                <p>{resumeText}</p>
            </div>

            <div className="chat-section">
                <h3>AI 면접 시뮬레이션</h3>
                <div className="chat-box">
                    {chat.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role}`}>
                            <strong>{msg.role === 'user' ? '나' : 'AI'}:</strong> {msg.content}
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
                    ></textarea>
                    <button onClick={handleSend}>전송</button>
                </div>
            </div>
        </div>
    );
};

export default Interview;

