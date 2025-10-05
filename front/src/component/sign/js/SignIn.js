// src/component/sign/js/SignIn.js
import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../scss/SignIn.scss';

const API_BASE = process.env.REACT_APP_API_BASE || '/api';

const SignIn = ({ setIsLoggedIn, setUserNickname, ChangeEventHandler }) => {
    const [form, setForm] = useState({ userId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [saveId, setSaveId] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, password } = form;

        if (!userId) return setErrorMsg('아이디를 입력해주세요.');
        if (!password) return setErrorMsg('비밀번호를 입력해주세요.');

        try {
            // 서버 로그인 엔드포인트 (현재 프로젝트 기준)
            const url = `${API_BASE}/user/login`;
            const res = await axios.post(
                url,
                { userId, userPassword: password },
                { withCredentials: true }
            );

            // 1) JSON 본문에서 토큰 시도
            let token =
                res.data?.accessToken ||
                res.data?.token ||
                res.data?.jwt ||
                (typeof res.data === 'string' ? res.data : null);

            // 2) 본문에 없으면 Authorization 헤더(Bearer …)에서 시도
            if (!token) {
                const authHeader =
                    res.headers?.authorization || res.headers?.Authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    token = authHeader.slice(7);
                }
            }

            if (!token) {
                setErrorMsg('로그인 성공했지만 토큰을 받지 못했습니다.');
                return;
            }

            // ✅ 통일: accessToken 키로 저장 (호환을 위해 jwtToken도 같이 저장)
            localStorage.setItem('accessToken', token);
            localStorage.setItem('jwtToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (saveId) localStorage.setItem('savedUserId', userId);
            else localStorage.removeItem('savedUserId');

            setIsLoggedIn?.(true);
            setUserNickname?.(userId);
            navigate('/');
            setForm({ userId: '', password: '' });
        } catch (error) {
            setErrorMsg('아이디와 비밀번호를 확인해주세요');
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
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'O' : 'X️'}
                        </button>
                    </div>
                </label>

                <div className="options">
                    <label className="save-id">
                        <div>
                        아이디 저장
                        </div>
                        <input
                            type="checkbox"
                            checked={saveId}
                            onChange={() => setSaveId(!saveId)}
                        />
                    </label>
                    <div >
                        <Link to={`/signup`} className="move-signup">
                            회원가입으로 이동
                        </Link>
                    </div>
                </div>

                {errorMsg && <p className="error-msg">{errorMsg}</p>}

                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default SignIn;
