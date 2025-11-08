import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

import Header from './component/header/js/Header';
import Footer from './component/footer/js/Footer';

import Home from './component/main/js/Home';
import SignIn from "./component/sign/js/SignIn";
import SignUp from "./component/sign/js/SignUp";
import Mypage from "./component/mypage/js/Mypage";
import AiInviewer from './component/AIInviewer/js/AiInviewer';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyInfo } from "./api/user";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // --- 북마크 상태 App에서 중앙 관리 ---
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
        <BrowserRouter>
            <Header
                isLoggedIn={isLoggedIn}
                userNickname={userNickname}
                onLogout={handleLogout}
            />
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                    <Route path="/AiInviewer" element={
                        <AiInviewer bookmarks={aiBookmarks} setBookmarks={setAiBookmarks} />
                    } />
                    <Route path="/mypage" element={
                        <Mypage bookmarks={aiBookmarks} setBookmarks={setAiBookmarks} />
                    } />
                    <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} setUserNickname={setUserNickname} setCurrentUser={setCurrentUser} />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
