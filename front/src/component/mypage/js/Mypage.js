import "../scss/Mypage.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

import ProfileView from "./ProfileView";
import ResumeView from "./ResumeView";
import BookmarkView from "./BookmarkView";
import SettingsView from "./SettingsView";

const Mypage = ({ bookmarks, setBookmarks }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const { data } = await api.get("/user/me");
                setUserInfo(data);
            } catch (error) {
                console.error("유저 정보 가져오기 실패", error);
            }
        };
        fetchUserInfo();
    }, [navigate]);

    const goToEditPage = () => {
        navigate("/mypage-edit", { state: { userInfo } });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileView userInfo={userInfo} onGoToEdit={goToEditPage} />;
            case "resume":
                return <ResumeView />;
            case "bookmark":
                return <BookmarkView bookmarks={bookmarks} setBookmarks={setBookmarks} />;
            case "settings":
                return <SettingsView />;
            default:
                return null;
        }
    };

    return (
        <div className="mypage-wrapper">
            <div className="mypage-container">
                <aside className="sidebar">
                    <button className={`nav-link ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                        Profile
                    </button>
                    <button className={`nav-link ${activeTab === "resume" ? "active" : ""}`} onClick={() => setActiveTab("resume")}>
                        Resume
                    </button>
                    <button className={`nav-link ${activeTab === "bookmark" ? "active" : ""}`} onClick={() => setActiveTab("bookmark")}>
                        Bookmarks
                    </button>
                    <button className={`nav-link ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
                        Settings
                    </button>
                </aside>

                <main className="tab-content">
                    {renderTabContent()}
                </main>
            </div>
        </div>
    );
};

export default Mypage;
