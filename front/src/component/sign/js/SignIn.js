import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../scss/SignIn.scss';

const SignIn = ({ setIsLoggedIn, setUserNickname }) => {
    const [form, setForm] = useState({ userId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [saveId, setSaveId] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, password } = form;

        if (!userId) return setErrorMsg('아이디를 입력해주세요.');
        if (!password) return setErrorMsg('비밀번호를 입력해주세요.');

        try {
            const response = await axios.post('http://localhost:10000/api/user/login', {
                userId,
                userPassword: password
            });

            const token = response.data;
            localStorage.setItem('jwtToken', token);

            if (saveId) localStorage.setItem('savedUserId', userId);
            else localStorage.removeItem('savedUserId');

            setIsLoggedIn(true);
            setUserNickname(userId);
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
                            아이디 저장
                        <input type="checkbox" checked={saveId} onChange={() => setSaveId(!saveId)} />
                    </label>
                </div>

                {errorMsg && <p className="error-msg">{errorMsg}</p>}

                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default SignIn;
