import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../scss/SignIn.scss';

const API_BASE = process.env.REACT_APP_API_BASE || '/api';

const SignIn = ({ setIsLoggedIn, setUserNickname }) => {
    const [form, setForm] = useState({ userId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [saveId, setSaveId] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // 저장된 아이디 불러오기
    useEffect(() => {
        const saved = localStorage.getItem('savedUserId');
        if (saved) {
            setForm((prev) => ({ ...prev, userId: saved }));
            setSaveId(true);
        }
    }, []);

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
            const res = await axios.post(
                `${API_BASE}/user/login`,
                { userId, userPassword: password },
                { withCredentials: true }
            );

            let token =
                res.data?.accessToken ||
                res.data?.token ||
                res.data?.jwt ||
                (typeof res.data === 'string' ? res.data : null);

            if (!token) {
                const authHeader = res.headers?.authorization || res.headers?.Authorization;
                if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);
            }

            if (!token) {
                setErrorMsg('로그인 성공했지만 토큰을 받지 못했습니다.');
                return;
            }

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
            setErrorMsg('아이디와 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h2>로그인</h2>
                <form onSubmit={handleSubmit} className="signin-form">
                    <label className="input-label">
                        아이디
                        <input
                            type="text"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요"
                        />
                    </label>

                    <label className="input-label">
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
                                {showPassword ? 'X' : 'O️'}
                            </button>
                        </div>
                    </label>

                    <div className="options">
                        <label className="save-id">
                            <input
                                type="checkbox"
                                checked={saveId}
                                onChange={() => setSaveId(!saveId)}
                            />
                            아이디 저장
                        </label>
                        <Link to="/signup" className="move-signup">
                            회원가입
                        </Link>
                    </div>

                    {errorMsg && <p className="error-msg">{errorMsg}</p>}

                    <button type="submit" className="signin-btn">
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
