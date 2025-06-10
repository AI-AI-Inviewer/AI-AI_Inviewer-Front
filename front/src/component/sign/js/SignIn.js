import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../scss/SignIn.scss';

const SignIn = ({ setIsLoggedIn, setUserNickname }) => {
    const [form, setForm] = useState({
        userId: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, password } = form;

        if (!userId ) {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:10000/api/user/login', {
                userId,
                userPassword: password
            });
            const token = response.data;
            localStorage.setItem('jwtToken', token);  // ✅ 수정 완료

            alert(`${userId}님, 환영합니다`);
            setIsLoggedIn(true);
            setUserNickname(userId);  // 아이디 기반 닉네임 설정
            navigate('/');
            setForm({ userId: '', password: '' });
        } catch (error) {
            console.error('로그인 실패:', error);
            alert('아이디와 비밀번호를 확인해주세요');
        }
    };



    return (
        <div className="signin-container">
            <h2>로그인</h2>
            <form className="signin-form" onSubmit={handleSubmit}>
                <label>
                    아이디
                    <input
                        type="text"
                        name="userId"
                        value={form.userId}
                        onChange={handleChange}
                        placeholder="아이디를 입력하세요"
                    />
                </label>
                <label>
                    비밀번호
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                </label>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default SignIn;
