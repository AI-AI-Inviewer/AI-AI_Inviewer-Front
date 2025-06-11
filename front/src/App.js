import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

// ✅ 헤더와 푸터
import Header from './component/header/js/Header';
import Footer from './component/footer/js/Footer';

// ✅ 홈 페이지
import Home from './component/main/js/Home';

// ✅ 로그인 & 회원가입
import SignIn from "./component/sign/js/SignIn";
import SignUp from "./component/sign/js/SignUp";

// ✅ 마이페이지
import Mypage from "./component/mypage/js/Mypage";
import MypageEdit from "./component/mypage-edit/js/Mypage-edit";

// ✅ AI 면접
import AiInviewer from "./component/AIInviewer/js/AiInviewer"; // 경로 주의!
import Interview from "./component/interview/js/Interview";

// ✅ 자기소개서
import CL from "./component/jasoseo/js/CL";
import CLDetail from "./component/jasoseo/js/CLDetail";

// ✅ 커뮤니티
import FeedBack from "./component/community/js/FeedBack";
import FeedBackWrite from "./component/community/js/FeedBack-write";
import FeedBackDetail from "./component/community/js/FeedBackDetail";
import PostScript from "./component/community/js/PostScript";
import PostScriptWrite from "./component/community/js/PostScript-write";
import PostScriptDetail from "./component/community/js/PostScriptDetail";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
    const [isCheckHeader, setIsCheckHeader] = useState("True");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState("");

    function ChangeEventHandler(text) {
        setIsCheckHeader(text);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserNickname("");
    }

    return (
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <BrowserRouter>
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
                        <Route path="/captcha" element={<AiInviewer isCheckHeader={isCheckHeader} />} />
                        <Route path="/cl" element={<CL isCheckHeader={isCheckHeader} />} />
                        <Route path="/cl/:id" element={<CLDetail />} />
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
                                    userNickname={userNickname}
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
                                />
                            }
                        />
                        <Route path="/signup" element={<SignUp isCheckHeader={isCheckHeader} />} />
                        <Route path="/interview" element={<Interview />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
