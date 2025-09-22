import "../scss/Mypage.scss";
import pic from '../../imgs/profile.jpg';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';

const Mypage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        userNum: '',
        userId: '',
        userName: '',
        userNickname: '',
        userEmail: ''
    });

    const [activeTab, setActiveTab] = useState('profile'); // 탭 상태

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:10002/api/user/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('사용자 정보 불러오기 오류:', error);
                alert(`사용자 정보를 불러오는데 실패했습니다. (${error.response?.status || '네트워크 오류'})`);
            }
        };
        fetchUserInfo();
    }, []);

    const goToEditPage = () => {
        navigate('/mypage-edit', { state: { userInfo } });
    };

    return (
        <div className="mypage-container">
            <div className="d-flex">
                {/* 사이드바 */}
                <div className="sidebar">
                    <button
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`nav-link ${activeTab === 'bookmark' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookmark')}
                    >
                        즐찾
                    </button>
                    <button
                        className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="tab-content">
                    {activeTab === 'profile' && (
                        <div className="profile">
                            <img src={pic} alt="프로필 이미지" className="profile-img" />
                            <div className="profile-item">
                                <small>사용자명</small>
                                <input type="text" className="form-control" value={userInfo.userName || ''} readOnly />
                            </div>
                            <div className="profile-item">
                                <small>아이디</small>
                                <input type="text" className="form-control" value={userInfo.userId || ''} readOnly />
                            </div>
                            <div className="profile-item">
                                <small>닉네임</small>
                                <input type="text" className="form-control" value={userInfo.userNickname || ''} readOnly />
                            </div>
                            <div className="profile-item">
                                <small>이메일</small>
                                <input type="email" className="form-control" value={userInfo.userEmail || ''} readOnly />
                            </div>
                            <div className="profile-item" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button id="editbtn" className="btn" onClick={goToEditPage}>정보 수정</button>
                                <button id="deletebtn" className="btn">회원 탈퇴</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookmark' && (
                        <div className="tab-pane">
                            <h1>북마크 페이지</h1>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="tab-pane">
                            <h1>설정 페이지</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Mypage;
