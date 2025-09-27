// src/component/mypage-edit/js/Mypage-edit.js
import "../scss/Mypage-edit.scss";
import pic from "../../imgs/profile.jpg";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "../../../api/user";

const MypageEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const ui = location.state?.userInfo ?? {};
        setUserName(ui.userName ?? "");
        setUserNickname(ui.userNickname ?? "");
        setUserEmail(ui.userEmail ?? "");
    }, [location.state]); // ← location.state만 의존

    const handleSave = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/signin");
            return;
        }
        if (!userName.trim() || !userNickname.trim() || !userEmail.trim()) {
            alert("모든 필드를 입력해 주세요.");
            return;
        }

        try {
            await updateUser({ userName, userNickname, userEmail });
            alert("사용자 정보가 수정되었습니다.");
            navigate("/mypage");
        } catch (error) {
            console.error("사용자 정보 업데이트 실패:", error);
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
                navigate("/signin");
            } else {
                alert("정보 수정에 실패했습니다.");
            }
        }
    };

    const handleCancel = () => navigate("/mypage");

    return (
        <div className="App">
            <header className="App-header">
                <div className="d-flex align-items-start" id="sidebar">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-profile">
                            <div className="profile">
                                <div className="profileItem">
                                    <img src={pic} alt="프로필 이미지 수정" id="profileImg" />
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
