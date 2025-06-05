/*const FeedBack = () => {
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
};*/
import React, { useState } from 'react';
import '../scss/PostScript.scss';
import { Link } from 'react-router-dom';

const PostScript = () => {
    const postscript = [
        { id: 4, title: "면접 후기4", content: "asdasdasd", date: "2025-05-28", writer: "gptuser"},
        { id: 5, title: "면접 후기5", content: "zxczxcxzc", date: "2025-06-01", writer: "gptuser"},
        { id: 6, title: "면접 후기6", content: "qweqweqwe", date: "2025-06-10", writer: "gptuser"},
    ];

    return (
        <div className="postscript-container">
            <h2>면접 후기 게시판</h2>
            <ul className="postscript-list">
                {postscript.map(postscript => (
                    <li key={postscript.id} className="postscript-item">
                        <Link to={`/postscript/${postscript.id}`} state={postscript} className="postscript-title-link">
                        <div className="postscript-title">{postscript.title}</div>
                        <div className="postscript-date">{postscript.date}</div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="postscript-btn-wrapper bottom">
                <Link to="/postscript/write" className="btn amado-btn" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                    글쓰기
                </Link>
            </div>
        </div>
    );
};

export default PostScript;
