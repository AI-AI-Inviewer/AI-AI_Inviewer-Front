import React, { useState } from 'react';
import '../scss/SignUp.scss';
import { registerUser } from '../../../api/user';
import {useNavigate} from "react-router-dom";


const SignUp = () => {
    const [form, setForm] = useState({
        userId: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: '',
        nickname: '',
        profileImage: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setForm(prev => ({ ...prev, profileImage: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { userId, password, confirmPassword, email, name, nickname } = form;

        // input 엘리먼트 찾기
        const userIdInput = document.getElementById('userId');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('name');
        const nicknameInput = document.getElementById('nickname');

        // 아이디 검사
        if (!userId) {
            alert('아이디를 입력해 주세요.');
            if (userIdInput) userIdInput.focus();
            return;
        }

        if (!name) {
            alert('이름을 입력해 주세요.');
            if (nameInput) nameInput.focus();
            return;

        }

        if (!email) {
            alert('이메일을 입력해 주세요.');
            if (emailInput) emailInput.focus();

            return;

        }

        if (!password) {
            alert('비밀번호를 입력해 주세요.');
            if (passwordInput) passwordInput.focus();

            return;
        }
        // 비밀번호 확인 검사
        if (!confirmPassword) {
            alert('비밀번호 확인을 입력해 주세요.');
            if (confirmPasswordInput) confirmPasswordInput.focus();
            return;
        }

        if (!nickname) {
            alert('닉네임을 입력해 주세요.');
            if (nicknameInput) nicknameInput.focus();
            return;
        }
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            if (confirmPasswordInput) confirmPasswordInput.focus();
            return;
        }

        try {
            await registerUser(form);
            alert(`${userId}님, 회원가입이 완료되었습니다!`);
            navigate('/');
            setForm({
                userId: '',
                password: '',
                confirmPassword: '',
                email: '',
                name: '',
                nickname: '',
                profileImage: null,
            });

        } catch (error) {
            console.error('[회원가입 오류]', error);
            alert('회원가입에 실패했습니다.');
        }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
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
                    비밀번호
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                </label>

                <label>
                    비밀번호 확인
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호를 다시 입력하세요"
                    />
                </label>
                <label>
                    닉네임
                    <input
                        type="text"
                        name="nickname"
                        value={form.nickname}
                        onChange={handleChange}
                        placeholder="닉네임을 입력하세요"
                    />
                </label>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default SignUp;
