import React, { useState } from 'react';
import '../scss/PostScript-write.scss';
import { useNavigate } from 'react-router-dom';

const PostScriptWrite = () => {
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
        alert(`감사합니다, ${form.name}님! 면접 후기가 등록되었습니다.`);
        setForm({ name: '', message: '' });
        
        navigate('/postscript');
    };

    return (
        <div className="postscript-container">
            <h2>면접 후기 작성</h2>
            <form onSubmit={handleSubmit} className="postscript-form">
                <label>
                    이름
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력하세요"/>
                </label>
                <label>
                    면접 후기
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="면접 후기를 입력하세요" rows="6"/>
                </label>
                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default PostScriptWrite;