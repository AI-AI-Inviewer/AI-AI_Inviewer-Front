import React, { useState } from 'react';
import '../scss/SignUp.scss';
import { registerUser } from '../../../api/user';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [form, setForm] = useState({
        userId: '', password: '', confirmPassword: '', email: '', name: '', nickname: '', profileImage: null
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'profileImage' ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, password, confirmPassword, email, name, nickname } = form;

        if (!userId || !name || !email || !password || !confirmPassword || !nickname) {
            return alert('모든 필수 항목을 입력해주세요.');
        }

        if (password !== confirmPassword) return alert('비밀번호가 일치하지 않습니다.');

        try {
            await registerUser(form);
            alert(`${userId}님, 회원가입이 완료되었습니다!`);
            navigate('/');
            setForm({ userId: '', password: '', confirmPassword: '', email: '', name: '', nickname: '', profileImage: null });
        } catch {
            alert('회원가입 실패');
        }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label>
                    아이디
                    <input type="text" name="userId" value={form.userId} onChange={handleChange} placeholder="아이디를 입력하세요" />
                </label>
                <label>
                    이름
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력하세요" />
                </label>
                <label>
                    이메일
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="이메일을 입력하세요" />
                </label>
                <label>
                    비밀번호
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" />
                </label>
                <label>
                    비밀번호 확인
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" />
                </label>
                <label>
                    닉네임
                    <input type="text" name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임을 입력하세요" />
                </label>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default SignUp;
