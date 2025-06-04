import React, { useState } from 'react';
import '../scss/FeedBack-write.scss';
import { useNavigate } from 'react-router-dom';

const FeedBackWrite = () => {
    const [form, setForm] = useState({ name: '', message: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.message) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }
        alert(`감사합니다, ${form.name}님! 피드백이 등록되었습니다.`);
        setForm({ name: '', message: '' });
        
        navigate('/feedback');
    };

    return (
        <div className="feedback-container">
            <h2>피드백 작성</h2>
            <form onSubmit={handleSubmit} className="feedback-form">
                <label>
                    이름
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력하세요"/>
                </label>
                <label>
                    피드백 내용
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="피드백 내용을 입력하세요" rows="6"/>
                </label>
                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default FeedBackWrite;