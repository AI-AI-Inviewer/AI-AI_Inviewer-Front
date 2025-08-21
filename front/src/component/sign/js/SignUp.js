import React, { useState } from 'react';
import '../scss/SignUp.scss';
import { registerUser, checkUserId, checkNickname } from '../../../api/user';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [form, setForm] = useState({
        userId: '', password: '', confirmPassword: '', email: '', name: '', nickname: '', profileImage: null
    });
    const [isUserIdChecked, setIsUserIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'profileImage' ? files[0] : value }));
        if (name === 'userId') setIsUserIdChecked(false);
        if (name === 'nickname') setIsNicknameChecked(false);
    };

    const handleUserIdCheck = async () => {
        if (!form.userId) return alert('아이디를 입력해 주세요.');
        try {
            const res = await checkUserId(form.userId);
            if (res.data.available) setIsUserIdChecked(true);
            else setIsUserIdChecked(false);
            alert(res.data.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
        } catch { alert('아이디 중복 검사 실패'); }
    };

    const handleNicknameCheck = async () => {
        if (!form.nickname) return alert('닉네임을 입력해 주세요.');
        try {
            const res = await checkNickname(form.nickname);
            if (res.data.available) setIsNicknameChecked(true);
            else setIsNicknameChecked(false);
            alert(res.data.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
        } catch { alert('닉네임 중복 검사 실패'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, password, confirmPassword, email, name, nickname } = form;

        if (!userId || !isUserIdChecked || !name || !email || !password || !confirmPassword || !nickname || !isNicknameChecked) {
            return alert('필수 항목과 중복검사를 완료해주세요.');
        }

        if (password !== confirmPassword) return alert('비밀번호가 일치하지 않습니다.');

        try {
            await registerUser(form);
            alert(`${userId}님, 회원가입이 완료되었습니다!`);
            navigate('/');
            setForm({ userId: '', password: '', confirmPassword: '', email: '', name: '', nickname: '', profileImage: null });
        } catch { alert('회원가입 실패'); }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label>
                    아이디
                    <div className="input-with-btn">
                        <input type="text" name="userId" value={form.userId} onChange={handleChange} placeholder="아이디를 입력하세요" />
                        <button type="button" onClick={handleUserIdCheck}>중복검사</button>
                    </div>
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
                    <div className="input-with-btn">
                        <input type="text" name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임을 입력하세요" />
                        <button type="button" onClick={handleNicknameCheck}>중복검사</button>
                    </div>
                </label>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default SignUp;
