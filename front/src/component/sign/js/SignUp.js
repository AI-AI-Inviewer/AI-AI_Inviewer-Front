// src/pages/auth/SignUp.jsx
import React, { useState, useEffect } from 'react';
import '../scss/SignUp.scss';
import { registerUser, checkUserId, checkNickname, sendEmailCode, verifyEmailCode } from '../../../api/user';
import {Link, useNavigate} from 'react-router-dom';

const COOLDOWN_SEC = 60;

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

    const [emailCode, setEmailCode] = useState('');
    const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown(c => c - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        let v = name === 'profileImage' ? files[0] : value;

        if (name === 'email') {
            v = (v || '').trim().toLowerCase(); // ✅ 백엔드와 동일 정규화
            setIsEmailCodeSent(false);
            setIsEmailVerified(false);
            setEmailCode('');
        }
        setForm(prev => ({ ...prev, [name]: v }));

        if (name === 'userId') setIsUserIdChecked(false);
        if (name === 'nickname') setIsNicknameChecked(false);
    };

    const handleUserIdCheck = async () => {
        if (!form.userId) return alert('아이디를 입력해 주세요.');
        try {
            const { available } = await checkUserId(form.userId);
            setIsUserIdChecked(!!available);
            alert(available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
        } catch (err) {
            console.error('ID check error:', err?.response?.status, err?.response?.data);
            alert(`아이디 중복 검사 실패 (${err?.response?.status ?? '네트워크 오류'})`);
        }
    };

    const handleNicknameCheck = async () => {
        if (!form.nickname) return alert('닉네임을 입력해 주세요.');
        try {
            const { available } = await checkNickname(form.nickname);
            setIsNicknameChecked(!!available);
            alert(available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
        } catch (err) {
            console.error('Nickname check error:', err?.response?.status, err?.response?.data);
            alert(`닉네임 중복 검사 실패 (${err?.response?.status ?? '네트워크 오류'})`);
        }
    };

    const handleSendEmailCode = async () => {
        if (!form.email) return alert('이메일을 입력해 주세요.');
        if (cooldown > 0) return;
        try {
            const res = await sendEmailCode(form.email);
            if (res?.ok === true || res?.success === true) {
                setIsEmailCodeSent(true);
                setCooldown(COOLDOWN_SEC);
                alert('인증 코드가 이메일로 전송되었습니다. 10분 내에 입력해 주세요.');
            } else {
                alert(res?.message || '코드 전송 실패');
            }
        } catch (err) {
            console.error('send code error:', err?.response?.status, err?.response?.data);
            alert(err?.response?.data?.message || '코드 전송 실패');
        }
    };

    const handleVerifyEmailCode = async () => {
        if (!form.email) return alert('이메일을 입력해 주세요.');
        if (!emailCode) return alert('인증 코드를 입력해 주세요.');
        try {
            const res = await verifyEmailCode(form.email, emailCode);
            if (res?.ok) {
                setIsEmailVerified(true);
                alert('이메일 인증이 완료되었습니다.');
            } else {
                alert(res?.message || '인증 실패');
            }
        } catch (err) {
            console.error('verify code error:', err?.response?.status, err?.response?.data);
            alert(err?.response?.data?.message || '인증 실패');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, password, confirmPassword, email, name, nickname } = form;

        if (!userId || !isUserIdChecked || !name || !email || !password || !confirmPassword || !nickname || !isNicknameChecked) {
            return alert('필수 항목과 중복검사를 완료해주세요.');
        }
        if (!isEmailVerified) return alert('이메일 인증을 완료해 주세요.');
        if (password !== confirmPassword) return alert('비밀번호가 일치하지 않습니다.');

        try {
            await registerUser(form);
            alert(`${userId}님, 회원가입이 완료되었습니다!`);
            navigate('/');
            setForm({ userId: '', password: '', confirmPassword: '', email: '', name: '', nickname: '', profileImage: null });
            setIsEmailVerified(false);
            setIsEmailCodeSent(false);
            setEmailCode('');
        } catch (err) {
            console.error('register error:', err?.response?.status, err?.response?.data);
            alert(err?.response?.data?.message || '회원가입 실패');
        }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                {/* 아이디 */}
                <label>
                    아이디
                    <div className="input-with-btn">
                        <input type="text" name="userId" value={form.userId} onChange={handleChange} placeholder="아이디를 입력하세요" />
                        <button type="button" onClick={handleUserIdCheck}>중복검사</button>
                    </div>
                </label>

                {/* 이름 */}
                <label>
                    이름
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력하세요" />
                </label>

                {/* 이메일 */}
                <label>
                    이메일
                    <div className="input-with-btn">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="이메일을 입력하세요"
                            disabled={isEmailVerified}
                        />
                        <button type="button" onClick={handleSendEmailCode} disabled={isEmailVerified || cooldown > 0}>
                            {isEmailVerified ? '인증완료' : cooldown > 0 ? `재전송(${cooldown}s)` : '인증코드 보내기'}
                        </button>
                    </div>
                </label>

                {/* 코드 입력 */}
                {isEmailCodeSent && !isEmailVerified && (
                    <label>
                        이메일 인증코드
                        <div className="input-with-btn">
                            <input
                                type="text"
                                value={emailCode}
                                onChange={(e) => setEmailCode(e.target.value.replace(/\s+/g,'').trim())} // ✅ 모든 공백 제거
                                maxLength={6}
                                placeholder="6자리 코드를 입력"
                            />
                            <button type="button" onClick={handleVerifyEmailCode}>코드 확인</button>
                        </div>
                    </label>
                )}

                {/* 비번 */}
                <label>
                    비밀번호
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" />
                </label>
                <label>
                    비밀번호 확인
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" />
                </label>

                {/* 닉네임 */}
                <label>
                    닉네임
                    <div className="input-with-btn">
                        <input type="text" name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임을 입력하세요" />
                        <button type="button" onClick={handleNicknameCheck}>중복검사</button>
                    </div>
                </label>

                <button type="submit">회원가입</button>
            </form>
            <div className="form-divider">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Already have an account?</span>
                    </div>
                </div>
                <div className="signin-link">
                    <Link to={`/signin`}>
                        로그인으로 이동
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
