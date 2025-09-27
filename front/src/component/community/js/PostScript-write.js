// src/component/community/js/PostScript-write.js
import React, { useState } from 'react';
import '../scss/PostScript-write.scss';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosInstance';

const PostScriptWrite = () => {
    // 백엔드에 맞춰 title/content로 구성 (기존 name/message를 쓰고 싶으면 아래 주석 참고)
    const [form, setForm] = useState({ title: '', content: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.content.trim()) {
            alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        // 로그인(토큰) 확인 — 실제 Authorization 헤더 부착은 axios 인터셉터가 처리
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }

        try {
            // 예: POST /api/postscript  { title, content }
            await api.post('/postscript', form);
            alert('후기가 등록되었습니다.');
            navigate('/postscript');
        } catch (err) {
            console.error('후기 등록 실패:', err);
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                alert('권한이 없습니다. 로그인 후 다시 시도해 주세요.');
                navigate('/signin');
            } else {
                alert('후기 등록에 실패했습니다.');
            }
        }
    };

    return (
        <div className="postscript-container">
            <h2>면접 후기 작성</h2>
            <form onSubmit={handleSubmit} className="postscript-form">
                <label>
                    제목
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="제목을 입력하세요"
                    />
                </label>

                <label>
                    내용
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="면접 후기를 입력하세요"
                        rows="6"
                    />
                </label>

                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default PostScriptWrite;

