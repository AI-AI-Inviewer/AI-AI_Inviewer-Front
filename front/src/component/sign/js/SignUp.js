import React, { useState } from 'react';
import '../scss/SignUp.scss';
import { registerUser } from '../../../api/user';


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { userId, password, confirmPassword, email, name, nickname } = form;

        if (!userId || !password || !confirmPassword || !email || !name || !nickname) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await registerUser(form);
            alert(`${userId}님, 회원가입이 완료되었습니다!`);
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
