import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

import Header from './component/header/js/Header';
import Footer from './component/footer/js/Footer';
import Home from './component/main/js/Home';
import SignIn from "./component/sign/js/SignIn";
import SignUp from "./component/sign/js/SignUp";
import Mypage from "./component/mypage/js/Mypage";
import MypageEdit from "./component/mypage-edit/js/Mypage-edit";
import AiInviewer from "./component/AIInviewer/js/AiInviewer";
import Interview from "./component/interview/js/Interview";
import CL from "./component/jasoseo/js/CL";
import CLDetail from "./component/jasoseo/js/CLDetail";
import FeedBack from "./component/community/js/FeedBack";
import FeedBackWrite from "./component/community/js/FeedBack-write";
import FeedBackDetail from "./component/community/js/FeedBackDetail";
import PostScript from "./component/community/js/PostScript";
import PostScriptWrite from "./component/community/js/PostScript-write";
import PostScriptDetail from "./component/community/js/PostScriptDetail";
import JobPosting from "./component/jobposting/js/JobPosting";
import JobPostingDetail from "./component/jobposting/js/JobPostingDetail";
import ScrollToTop from "./component/common/js/ScrollToTop";
import FeedBackEdit from './component/community/js/FeedBackEdit';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyInfo } from "./api/user"; // JWT 기반 내 정보 조회

function App() {
    const [isCheckHeader, setIsCheckHeader] = useState("True");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState("");
    const [currentUser, setCurrentUser] = useState(null); // ✅ 추가

    function ChangeEventHandler(text) {
        setIsCheckHeader(text);
    }

    function handleLogout() {
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        setUserNickname("");
        setCurrentUser(null); // ✅ 추가
    }

    // 새로고침 시 로그인 유지
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            getMyInfo()
                .then((data) => {
                    setIsLoggedIn(true);
                    setUserNickname(data.userNickname ?? "");
                    setCurrentUser(data); // ✅ 전체 사용자 정보 저장 (userId, userName, userNickname, userNum 등)
                })
                .catch(() => {
                    // 토큰 유효하지 않으면 초기화
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
                {/* 페이지 이동 시 스크롤 초기화 */}
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
                        <Route path="/AiInviewer" element={<AiInviewer isCheckHeader={isCheckHeader} />} />
                        <Route path="/JobPosting" element={<JobPosting isCheckHeader={isCheckHeader} />} />
                        <Route path="/JobPosting/:id" element={<JobPostingDetail />} />
                        <Route path="/CL" element={<CL isCheckHeader={isCheckHeader} />} />
                        <Route path="/CL/:id" element={<CLDetail />} />

                        <Route
                            path="/feedback"
                            element={
                                <FeedBack
                                    isCheckHeader={isCheckHeader}
                                    isLoggedIn={isLoggedIn}
                                />
                            }
                        />
                        <Route
                            path="/feedback/write"
                            element={
                                <FeedBackWrite
                                    isLoggedIn={isLoggedIn}
                                    userNickname={userNickname}
                                />
                            }
                        />
                        <Route
                            path="/feedback/:communityNum"
                            element={
                                <FeedBackDetail
                                    isLoggedIn={isLoggedIn}
                                    currentUser={currentUser}  // ✅ 전달
                                />
                            }
                        />
                        <Route path="/postscript" element={<PostScript />} />
                        <Route path="/postscript/write" element={<PostScriptWrite />} />
                        <Route path="/postscript/:id" element={<PostScriptDetail />} />
                        <Route path="/mypage" element={<Mypage isCheckHeader={isCheckHeader} />} />
                        <Route path="/mypage-edit" element={<MypageEdit />} />
                        <Route
                            path="/signin"
                            element={
                                <SignIn
                                    setIsLoggedIn={setIsLoggedIn}
                                    setUserNickname={setUserNickname}
                                    setCurrentUser={setCurrentUser} // ✅ 로그인 직후 갱신할 수 있게 전달
                                />
                            }
                        />
                        <Route path="/signup" element={<SignUp isCheckHeader={isCheckHeader} />} />
                        <Route path="/interview" element={<Interview />} />

                        <Route
                            path="/feedback/:communityNum/edit"
                            element={
                                <FeedBackEdit
                                    isLoggedIn={isLoggedIn}
                                    currentUser={currentUser}  // ✅ 전달
                                />
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
