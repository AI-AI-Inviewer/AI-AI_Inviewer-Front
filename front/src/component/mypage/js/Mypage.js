import "../scss/Mypage.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

import ProfileView from "./ProfileView";
import BookmarkView from "./BookmarkView";
import SettingsView from "./SettingsView";

const Mypage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ /* ... */ });
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // ... 기존 데이터 fetching 로직은 동일 ...
                const { data } = await api.get("/user/me");
                setUserInfo(data);
            } catch (error) {
                // ... 기존 에러 핸들링 로직은 동일 ...
            }
        };
        fetchUserInfo();
    }, [navigate]);

    const goToEditPage = () => {
        navigate("/mypage-edit", { state: { userInfo } });
    };

    // 탭 컨텐츠를 렌더링하는 함수
    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileView userInfo={userInfo} onGoToEdit={goToEditPage} />;
            case "bookmark":
                return <BookmarkView />;
            case "settings":
                return <SettingsView />;
            default:
                return null;
        }
    };

    return (
        <div className="mypage-wrapper">
            <div className="mypage-container">
                {/* === 사이드바 === */}
                <aside className="sidebar">
                    <button className={`nav-link ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                        <span className="icon">👤</span> Profile
                    </button>
                    <button className={`nav-link ${activeTab === "bookmark" ? "active" : ""}`} onClick={() => setActiveTab("bookmark")}>
                        <span className="icon">⭐</span> Bookmarks
                    </button>
                    <button className={`nav-link ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
                        <span className="icon">⚙️</span> Settings
                    </button>
                </aside>

                {/* === 메인 컨텐츠 === */}
                <main className="tab-content">
                    {renderTabContent()}
                </main>
            </div>
        </div>
    );
};

export default Mypage;