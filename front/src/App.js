import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

import { HeaderProvider } from './component/header/context/HeaderContext';

import Header from './component/header/js/Header';
import Footer from './component/footer/js/Footer';
import Home from './component/main/js/Home';
import SignIn from "./component/sign/js/SignIn";
import SignUp from "./component/sign/js/SignUp";
import Mypage from "./component/mypage/js/Mypage";
import AiInviewer from './component/AIInviewer/js/AiInviewer';
import Interview from './component/interview/js/Interview';
import VoiceInterview from './component/interview/js/VoiceInterview';
import CL from "./component/jasoseo/js/CL";
import CLDetail from "./component/jasoseo/js/CLDetail";
import FeedBack from "./component/community/js/FeedBack";
import FeedBackWrite from "./component/community/js/FeedBack-write";
import FeedBackDetail from "./component/community/js/FeedBackDetail";
import FeedBackEdit from './component/community/js/FeedBackEdit';
import PostScript from "./component/community/js/PostScript";
import PostScriptWrite from "./component/community/js/PostScript-write";
import PostScriptDetail from "./component/community/js/PostScriptDetail";
import JobPosting from "./component/jobposting/js/JobPosting";
import ScrollToTop from "./component/common/js/ScrollToTop";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyInfo } from "./api/user";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const [aiBookmarks, setAiBookmarks] = useState(() => {
        const stored = localStorage.getItem('aiBookmarks');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('aiBookmarks', JSON.stringify(aiBookmarks));
    }, [aiBookmarks]);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            getMyInfo()
                .then((data) => {
                    setIsLoggedIn(true);
                    setUserNickname(data.userNickname ?? "");
                    setCurrentUser(data);
                })
                .catch(() => {
                    localStorage.removeItem("jwtToken");
                    setIsLoggedIn(false);
                });
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        setUserNickname("");
        setCurrentUser(null);
    }

    return (
        <HeaderProvider>
            <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <BrowserRouter>
                    <ScrollToTop />
                    <Header
                        isLoggedIn={isLoggedIn}
                        userNickname={userNickname}
                        onLogout={handleLogout}
                    />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            {/* --- 코어 페이지 --- */}
                            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                            <Route path="/AiInviewer" element={<AiInviewer bookmarks={aiBookmarks} setBookmarks={setAiBookmarks} />} />
                            {/* ★ 대소문자 주의: Header.jsx에서 /JobPosting 으로 링크 */}
                            <Route path="/JobPosting" element={<JobPosting />} />

                            {/* --- AI 면접 및 자소서 관련 --- */}
                            <Route path="/interview" element={<Interview />} />
                            <Route path="/voice-interview" element={<VoiceInterview />} />
                            <Route path="/CL" element={<CL />} />
                            <Route path="/CL/:id" element={<CLDetail />} />

                            {/* --- 커뮤니티 (피드백) --- */}
                            <Route path="/feedback" element={<FeedBack isLoggedIn={isLoggedIn} />} />
                            <Route path="/feedback/write" element={<FeedBackWrite isLoggedIn={isLoggedIn} userNickname={userNickname} />} />
                            <Route path="/feedback/:communityNum" element={<FeedBackDetail isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
                            <Route path="/feedback/:communityNum/edit" element={<FeedBackEdit isLoggedIn={isLoggedIn} currentUser={currentUser} />} />

                            {/* --- 커뮤니티 (합격후기) --- */}
                            <Route path="/postscript" element={<PostScript />} />
                            <Route path="/postscript/write" element={<PostScriptWrite />} />
                            <Route path="/postscript/:id" element={<PostScriptDetail />} />

                            {/* --- 사용자 (로그인, 회원가입, 마이페이지) --- */}
                            <Route path="/mypage" element={<Mypage />} />
                            <Route
                                path="/signin"
                                element={<SignIn setIsLoggedIn={setIsLoggedIn} setUserNickname={setUserNickname} setCurrentUser={setCurrentUser} />}
                            />
                            <Route path="/signup" element={<SignUp />} />
                        </Routes>
                    </main>
                    <Footer />
                </BrowserRouter>
            </div>
        </HeaderProvider>
    );
}

export default App;
