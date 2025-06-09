import "../scss/Mypage-edit.scss";
import pic from '../../imgs/profile.jpg';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MypageEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = location.state?.userInfo || {};

    const [userName, setUserName] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        setUserName(userInfo.userName || "");
        setUserNickname(userInfo.userNickname || "");
        setUserEmail(userInfo.userEmail || "");
    }, [userInfo]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const updatedUser = {
                userName,
                userNickname,
                userEmail
            };

            await axios.put(
                'http://localhost:10000/api/user/me',  // 포트 번호 반영!
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("사용자 정보가 수정되었습니다.");
            navigate('/mypage');
        } catch (error) {
            console.error("사용자 정보 업데이트 실패:", error);
            alert("정보 수정에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        navigate('/mypage');
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="d-flex align-items-start" id="sidebar">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-profile">
                            <div className="profile">
                                <div className="profileItem">
                                    <img src={pic} alt='프로필 이미지 수정' id="profileImg" />
                                </div>
                                <div className="profileItem">
                                    <small>사용자명</small>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div className="profileItem">
                                    <small>닉네임</small>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userNickname}
                                        onChange={(e) => setUserNickname(e.target.value)}
                                    />
                                </div>
                                <div className="profileItem">
                                    <small>이메일</small>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                    />
                                </div>
                                <div className="profileItem">
                                    <button id="editbtn" className="btn amado-btn" onClick={handleSave}>
                                        저장
                                    </button>
                                    <button id="cancelbtn" className="btn amado-btn" onClick={handleCancel}>
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default MypageEdit;
