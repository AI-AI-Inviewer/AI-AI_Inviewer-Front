import React, { useState } from 'react';
import '../scss/SignIn.scss';

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = form;

        if (!email || !password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        // 실제 로그인 처리 API 호출하면 됩니다.

        alert(`${email} 님, 로그인 성공!`);
        setForm({ email: '', password: '' });
    };

    return (
        <div className="signin-container">
            <h2>로그인</h2>
            <form className="signin-form" onSubmit={handleSubmit}>
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
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default SignIn;
