// src/component/mypage/js/Mypage.js
import "../scss/Mypage.scss";
import pic from "../../imgs/profile.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

const Mypage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        userNum: "",
        userId: "",
        userName: "",
        userNickname: "",
        userEmail: "",
    });
    const [activeTab, setActiveTab] = useState("profile"); // 탭 상태

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    alert("로그인이 필요합니다.");
                    navigate("/signin");
                    return;
                }
                // Authorization 헤더는 axios 인터셉터가 자동 부착
                const { data } = await api.get("/user/me");
                setUserInfo(data);
            } catch (error) {
                console.error("사용자 정보 불러오기 오류:", error);
                const status = error?.response?.status;
                if (status === 401 || status === 403) {
                    alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
                    navigate("/signin");
                } else {
                    alert(`사용자 정보를 불러오는데 실패했습니다. (${status || "네트워크 오류"})`);
                }
            }
        };
        fetchUserInfo();
    }, [navigate]);

    const goToEditPage = () => {
        navigate("/mypage-edit", { state: { userInfo } });
    };

    return (
        <div className="mypage-container">
            <div className="d-flex">
                {/* 사이드바 */}
                <div className="sidebar">
                    <button
                        className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile
                    </button>
                    <button
                        className={`nav-link ${activeTab === "bookmark" ? "active" : ""}`}
                        onClick={() => setActiveTab("bookmark")}
                    >
                        즐찾
                    </button>
                    <button
                        className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </button>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="tab-content">
                    {activeTab === "profile" && (
                        <div className="profile">
                            <img src={pic} alt="프로필 이미지" className="profile-img" />
                            <div className="profile-item">
                                <small>사용자명</small>
                                <input type="text" className="form-control" value={userInfo.userName || ""} readOnly />
                            </div>
                            <div className="profile-item">
                                <small>아이디</small>
                                <input type="text" className="form-control" value={userInfo.userId || ""} readOnly />
                            </div>
                            <div className="profile-item">
                                <small>닉네임</small>
                                <input type="text" className="form-control" value={userInfo.userNickname || ""} readOnly />
                            </div>
                            <div className="profile-item">
                                <small>이메일</small>
                                <input type="email" className="form-control" value={userInfo.userEmail || ""} readOnly />
                            </div>
                            <div className="profile-item" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                <button id="editbtn" className="btn" onClick={goToEditPage}>
                                    정보 수정
                                </button>
                                <button
                                    id="deletebtn"
                                    className="btn"
                                    onClick={() => alert("회원 탈퇴 기능은 추후 구현 예정입니다.")}
                                >
                                    회원 탈퇴
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "bookmark" && (
                        <div className="tab-pane">
                            <h1>북마크 페이지</h1>
                        </div>
                    )}

                    {activeTab === "settings" && (
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

