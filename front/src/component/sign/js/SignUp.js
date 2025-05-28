import React, { useState } from 'react';
import '../scss/SignUp.scss';

const SignUp = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = form;

        if (!name || !email || !password || !confirmPassword) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 여기서 실제 회원가입 API 호출을 할 수 있습니다.

        alert(`${name}님, 회원가입이 완료되었습니다!`);
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
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

                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default SignUp;
