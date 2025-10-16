import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";

import Header from './component/header/js/Header';
import Footer from './component/footer/js/Footer';
import Home from './component/main/js/Home';
import SignIn from "./component/sign/js/SignIn";
import SignUp from "./component/sign/js/SignUp";
import Mypage from "./component/mypage/js/Mypage";
import MypageEdit from "./component/mypage-edit/js/Mypage-edit";
import AiInviewer from './component/AIInviewer/js/AiInviewer';   // ← 여기만 수정
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
import JobPostingDetail from "./component/jobposting/js/JobPostingDetail";
import ScrollToTop from "./component/common/js/ScrollToTop";

<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyInfo } from "./api/user";
=======
import { getMyInfo } from "./api/user"; // JWT 기반 내 정보 조회
>>>>>>> 9f5148c722e89bbb790726cfe8bb6f830c7ccfeb

function App() {
    const [isCheckHeader, setIsCheckHeader] = useState("True");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
<<<<<<< HEAD

    // 🎯 전역 즐겨찾기 상태
    const [aiBookmarks, setAiBookmarks] = useState(() => {
        const stored = localStorage.getItem('aiBookmarks');
        return stored ? JSON.parse(stored) : [];
    });

    // 즐겨찾기 변경 시 LocalStorage 저장
    useEffect(() => {
        localStorage.setItem('aiBookmarks', JSON.stringify(aiBookmarks));
    }, [aiBookmarks]);
=======
>>>>>>> 9f5148c722e89bbb790726cfe8bb6f830c7ccfeb

    function ChangeEventHandler(text) {
        setIsCheckHeader(text);
    }

    function handleLogout() {
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        setUserNickname("");
        setCurrentUser(null);
    }

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
                    setUserNickname("");
                    setCurrentUser(null);
                });
        }
    }, []);

    return (
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <BrowserRouter>
                <ScrollToTop />
                <Header
                    isCheckHeader={isCheckHeader}
                    ChangeEventHandler={ChangeEventHandler}
                    isLoggedIn={isLoggedIn}
                    userNickname={userNickname}
                    onLogout={handleLogout}
                />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
<<<<<<< HEAD
                        <Route
                            path="/AiInviewer"
                            element={<AiInviewer bookmarks={aiBookmarks} setBookmarks={setAiBookmarks} />}
                        />
=======

                        {/* 채팅/음성 선택 진입 페이지 */}
                        <Route path="/AiInviewer" element={<AiInviewer isCheckHeader={isCheckHeader} />} />

                        {/* 기존 채팅 면접 */}
                        <Route path="/interview" element={<Interview />} />

                        {/* 새: 음성 아바타 면접 */}
                        <Route path="/voice-interview" element={<VoiceInterview />} />

>>>>>>> 9f5148c722e89bbb790726cfe8bb6f830c7ccfeb
                        <Route path="/JobPosting" element={<JobPosting isCheckHeader={isCheckHeader} />} />
                        <Route path="/JobPosting/:id" element={<JobPostingDetail />} />
                        <Route path="/CL" element={<CL isCheckHeader={isCheckHeader} />} />
                        <Route path="/CL/:id" element={<CLDetail />} />
<<<<<<< HEAD
                        <Route path="/feedback" element={<FeedBack isCheckHeader={isCheckHeader} isLoggedIn={isLoggedIn} />} />
                        <Route path="/feedback/write" element={<FeedBackWrite isLoggedIn={isLoggedIn} userNickname={userNickname} />} />
                        <Route path="/feedback/:communityNum" element={<FeedBackDetail isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
=======

                        <Route path="/feedback" element={<FeedBack isCheckHeader={isCheckHeader} />} />
                        <Route path="/feedback/write" element={<FeedBackWrite isLoggedIn={isLoggedIn} userNickname={userNickname} />} />
                        <Route path="/feedback/:communityNum" element={<FeedBackDetail isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
                        <Route path="/feedback/:communityNum/edit" element={<FeedBackEdit isLoggedIn={isLoggedIn} currentUser={currentUser} />} />

>>>>>>> 9f5148c722e89bbb790726cfe8bb6f830c7ccfeb
                        <Route path="/postscript" element={<PostScript />} />
                        <Route path="/postscript/write" element={<PostScriptWrite />} />
                        <Route path="/postscript/:id" element={<PostScriptDetail />} />

                        <Route path="/mypage" element={<Mypage isCheckHeader={isCheckHeader} />} />
                        <Route path="/mypage-edit" element={<MypageEdit />} />
<<<<<<< HEAD
                        <Route path="/signin" element={
                            <SignIn
                                setIsLoggedIn={setIsLoggedIn}
                                setUserNickname={setUserNickname}
                                setCurrentUser={setCurrentUser}
                            />
                        } />
                        <Route path="/signup" element={<SignUp isCheckHeader={isCheckHeader} />} />
                        <Route path="/interview" element={<Interview />} />
                        <Route path="/feedback/:communityNum/edit" element={<FeedBackEdit isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
=======

                        <Route
                            path="/signin"
                            element={
                                <SignIn
                                    setIsLoggedIn={setIsLoggedIn}
                                    setUserNickname={setUserNickname}
                                    setCurrentUser={setCurrentUser}
                                />
                            }
                        />
                        <Route path="/signup" element={<SignUp isCheckHeader={isCheckHeader} />} />
>>>>>>> 9f5148c722e89bbb790726cfe8bb6f830c7ccfeb
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
