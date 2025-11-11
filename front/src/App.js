import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from './component/header/js/Header';
import Footer from './component/footer/js/Footer';
import ScrollToTop from "./component/common/js/ScrollToTop";

import Home from "./component/main/js/Home";
import SignIn from "./component/sign/js/SignIn";
import SignUp from "./component/sign/js/SignUp";
import Mypage from "./component/mypage/js/Mypage";
import AiInviewer from './component/AIInviewer/js/AiInviewer';

import CL from "./component/jasoseo/js/CL";
import CLDetail from "./component/jasoseo/js/CLDetail";

import FeedBack from "./component/community/js/FeedBack";
import FeedBackWrite from "./component/community/js/FeedBack-write";
import FeedBackDetail from "./component/community/js/FeedBackDetail";
import FeedBackEdit from './component/community/js/FeedBackEdit';

import PostScript from "./component/community/js/PostScript";
import PostScriptWrite from "./component/community/js/PostScript-write";
import PostScriptDetail from "./component/community/js/PostScriptDetail";
import PostScriptEdit from "./component/community/js/PostScriptEdit";
import JobPosting from "./component/jobposting/js/JobPosting";

import Interview from "./component/interview/js/Interview";
import VoiceInterview from "./component/interview/js/VoiceInterview";

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
            getMyInfo(token).then(user => {
                setIsLoggedIn(true);
                setUserNickname(user.nickname);
                setCurrentUser(user);
            });
        }
    }, []);

    /* ⚙️ 푸터 ‘전체 높이’ 실측해서 CSS 변수에 반영 */
    useEffect(() => {
        const footerEl = document.querySelector('footer.footer');
        if (!footerEl) return;

        const updateFullHeight = () => {
            const full = footerEl.scrollHeight || 400; // 컨텐츠 전체 높이
            document.documentElement.style.setProperty('--footer-full', `${full}px`);
        };
        updateFullHeight();

        const ro = new ResizeObserver(updateFullHeight);
        ro.observe(footerEl);
        window.addEventListener('load', updateFullHeight);
        window.addEventListener('resize', updateFullHeight);

        return () => {
            ro.disconnect();
            window.removeEventListener('load', updateFullHeight);
            window.removeEventListener('resize', updateFullHeight);
        };
    }, []);

    /* ⚙️ 스크롤 방향/바닥 근처 감지 → 펼침/닫힘 토글(히스테리시스 적용) */
    useEffect(() => {
        const root = document.querySelector('.AppLayout');
        if (!root) return;

        let lastY = window.scrollY;
        let opened = false;

        const open = () => { if (!opened) { root.classList.add('footer-open'); opened = true; } };
        const close = () => { if (opened) { root.classList.remove('footer-open'); opened = false; } };

        const onScroll = () => {
            const doc = document.documentElement;
            const y = window.scrollY;
            const scrollable = doc.scrollHeight - window.innerHeight;
            const goingDown = y >= lastY;
            const nearBottom = y >= (scrollable - 12);

            if (goingDown && nearBottom) {
                open();                            // 아래로 스크롤해 바닥 근처면 펼침
            } else if (!goingDown && (lastY - y) > 200) {
                close();                           // 위로 200px 이상 올리면 다시 접힘
            }
            lastY = y;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        setUserNickname("");
        setCurrentUser(null);
    };

    return (
        <BrowserRouter>
            <div className="AppLayout">
                <ScrollToTop />
                <Header
                    isLoggedIn={isLoggedIn}
                    userNickname={userNickname}
                    onLogout={handleLogout}
                />
                <main className="AppMain">
                    <Routes>
                        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                        <Route path="/AiInviewer" element={<AiInviewer bookmarks={aiBookmarks} setBookmarks={setAiBookmarks} />} />
                        <Route path="/JobPosting" element={<JobPosting />} />
                        <Route path="/Interview" element={<Interview />} />
                        <Route path="/VoiceInterview" element={<VoiceInterview />} />

                        <Route path="/CL" element={<CL />} />
                        <Route path="/CL/:id" element={<CLDetail />} />

                        <Route path="/feedback" element={<FeedBack isLoggedIn={isLoggedIn} />} />
                        <Route path="/feedback/write" element={<FeedBackWrite isLoggedIn={isLoggedIn} userNickname={userNickname} />} />
                        <Route path="/feedback/:communityNum" element={<FeedBackDetail isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
                        <Route path="/feedback/:communityNum/edit" element={<FeedBackEdit isLoggedIn={isLoggedIn} currentUser={currentUser} />} />

                        <Route path="/postscript" element={<PostScript isLoggedIn={isLoggedIn} />} />
                        <Route path="/postscript/write" element={<PostScriptWrite isLoggedIn={isLoggedIn} />} />
                        <Route path="/postscript/:postscriptNum" element={<PostScriptDetail isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
                        <Route path="/postscript/:id" element={<PostScriptDetail isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
                        <Route path="/postscript/:postscriptNum/edit" element={<PostScriptEdit isLoggedIn={isLoggedIn} currentUser={currentUser} />} />

                        <Route path="/mypage" element={<Mypage bookmarks={aiBookmarks} setBookmarks={setAiBookmarks} />} />
                        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} setUserNickname={setUserNickname} setCurrentUser={setCurrentUser} />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </main>
                {/* Footer 루트에 className="footer" 있어야 함 */}
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
