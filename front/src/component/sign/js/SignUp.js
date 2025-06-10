import React, { useState } from 'react';
import '../scss/SignUp.scss';
import { registerUser, checkUserId, checkNickname } from '../../../api/user';  // 중복 검사 API 추가
import { useNavigate } from 'react-router-dom';

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

    const [isUserIdChecked, setIsUserIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'profileImage' ? files[0] : value
        }));

        // 입력 변경 시 중복 검사 플래그 리셋
        if (name === 'userId') setIsUserIdChecked(false);
        if (name === 'nickname') setIsNicknameChecked(false);
    };

    const handleUserIdCheck = async () => {
        if (!form.userId) {
            alert('아이디를 입력해 주세요.');
            return;
        }
        try {
            const res = await checkUserId(form.userId);
            if (res.data.available) {
                alert('사용 가능한 아이디입니다.');
                setIsUserIdChecked(true);
            } else {
                alert('이미 사용 중인 아이디입니다.');
                setIsUserIdChecked(false);
            }
        } catch (err) {
            console.error('[아이디 중복 검사 오류]', err);
            alert('아이디 중복 검사에 실패했습니다.');
        }
    };

    const handleNicknameCheck = async () => {
        if (!form.nickname) {
            alert('닉네임을 입력해 주세요.');
            return;
        }
        try {
            const res = await checkNickname(form.nickname);
            if (res.data.available) {
                alert('사용 가능한 닉네임입니다.');
                setIsNicknameChecked(true);
            } else {
                alert('이미 사용 중인 닉네임입니다.');
                setIsNicknameChecked(false);
            }
        } catch (err) {
            console.error('[닉네임 중복 검사 오류]', err);
            alert('닉네임 중복 검사에 실패했습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { userId, password, confirmPassword, email, name, nickname } = form;

        if (!userId) {
            alert('아이디를 입력해 주세요.');
            return;
        }

        if (!isUserIdChecked) {
            alert('아이디 중복 검사를 완료해 주세요.');
            return;
        }

        if (!name) {
            alert('이름을 입력해 주세요.');
            return;
        }

        if (!email) {
            alert('이메일을 입력해 주세요.');
            return;
        }

        if (!password) {
            alert('비밀번호를 입력해 주세요.');
            return;
        }

        if (!confirmPassword) {
            alert('비밀번호 확인을 입력해 주세요.');
            return;
        }

        if (!nickname) {
            alert('닉네임을 입력해 주세요.');
            return;
        }

        if (!isNicknameChecked) {
            alert('닉네임 중복 검사를 완료해 주세요.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요"
                            id="userId"
                        />
                        <button type="button" onClick={handleUserIdCheck}>중복검사</button>
                    </div>
                </label>
                <label>
                    이름
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="이름을 입력하세요"
                        id="name"
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
                        id="email"
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
                        id="password"
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
                        id="confirmPassword"
                    />
                </label>
                <label>
                    닉네임
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            name="nickname"
                            value={form.nickname}
                            onChange={handleChange}
                            placeholder="닉네임을 입력하세요"
                            id="nickname"
                        />
                        <button type="button" onClick={handleNicknameCheck}>중복검사</button>
                    </div>
                </label>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default SignUp;
