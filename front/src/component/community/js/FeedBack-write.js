import React, { useState } from 'react';
import '../scss/FeedBack-write.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedBackWrite = () => {
    const [form, setForm] = useState({ title: '', content: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.post('http://localhost:10000/api/community', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('게시글이 등록되었습니다.');
            navigate('/feedback');
        } catch (error) {
            console.error('게시글 등록 오류:', error);
            alert('게시글 등록에 실패했습니다.');
        }
    };

    return (
        <div className="feedback-container">
            <h2>피드백 작성</h2>
            <form onSubmit={handleSubmit} className="feedback-form">
                <label>
                    제목
                    <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="제목을 입력하세요"/>
                </label>
                <label>
                    내용
                    <textarea name="content" value={form.content} onChange={handleChange} placeholder="내용을 입력하세요" rows="6"/>
                </label>
                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default FeedBackWrite;
