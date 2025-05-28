import React, { useState } from 'react';
import '../scss/FeedBack.scss';

const FeedBack = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 간단한 유효성 검사
        if (!form.name || !form.email || !form.message) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }

        alert(`감사합니다, ${form.name}님! 피드백이 접수되었습니다.`);
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="feedback-container">
            <h2>피드백 보내기</h2>
            <form onSubmit={handleSubmit} className="feedback-form">
                <label>
                    이름
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="이름을 입력하세요"
                    />
                </label>

                <label>
                    이메일
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="이메일을 입력하세요"
                    />
                </label>

                <label>
                    피드백 내용
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="피드백 내용을 입력하세요"
                        rows="6"
                    />
                </label>

                <button type="submit">보내기</button>
            </form>
        </div>
    );
};

export default FeedBack;
