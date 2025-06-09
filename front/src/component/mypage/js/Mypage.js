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

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwtToken');  // ✅ 수정
                const response = await axios.get('http://localhost:10000/api/user/me', {  // ✅ 수정
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
        <div className="App">
            <header className="App-header">
                <div className="d-flex align-items-start" id="sidebar">
                    <div className="nav flex-column nav-pills me-3" role="tablist" aria-orientation="vertical">
                        <div className="sidebar">
                            <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill"
                                    data-bs-target="#v-pills-profile" type="button" role="tab"
                                    aria-controls="v-pills-profile" aria-selected="true">Profile
                            </button>
                            <button className="nav-link" id="v-pills-bookmark-tab" data-bs-toggle="pill"
                                    data-bs-target="#v-pills-bookmark" type="button" role="tab"
                                    aria-controls="v-pills-bookmark" aria-selected="false">즐찾
                            </button>
                            <button className="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                                    data-bs-target="#v-pills-settings" type="button" role="tab"
                                    aria-controls="v-pills-settings" aria-selected="false">Settings
                            </button>
                        </div>
                    </div>

                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel">
                            <div className="profile">
                                <div className="profileItem">
                                    <img src={pic} alt="프로필 이미지" id="profileImg" />
                                </div>
                                <div className="profileItem">
                                    <small>사용자명</small>
                                    <input type="text" className="form-control" value={userInfo.userName || ''} readOnly />
                                </div>
                                <div className="profileItem">
                                    <small>아이디</small>
                                    <input type="text" className="form-control" value={userInfo.userId || ''} readOnly />
                                </div>
                                <div className="profileItem">
                                    <small>닉네임</small>
                                    <input type="text" className="form-control" value={userInfo.userNickname || ''} readOnly />
                                </div>
                                <div className="profileItem">
                                    <small>이메일</small>
                                    <input type="email" className="form-control" value={userInfo.userEmail || ''} readOnly />
                                </div>
                                <div className="profileItem">
                                    <button id="editbtn" className="btn amado-btn" onClick={goToEditPage}>
                                        정보 수정
                                    </button>
                                    <a id="deletebtn" href="#" className="btn amado-btn">회원 탈퇴</a>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="v-pills-bookmark" role="tabpanel">
                            <h1>북마크 페이지</h1>
                        </div>
                        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel">
                            <h1>설정 페이지</h1>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Mypage;
