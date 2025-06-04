// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import "./App.css";
// import Header from "./component/header/js/Header";
// import Footer from "../src/component/footer/js/Footer"
// import CaptCha from "../src/component/captcha/js/CaptCha";
// //import CodeTool from "../src/component/codeTool/js/CodeTool";
// //import Community from "./component/community/js/Community";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { useState } from "react";
// import Home from "./component/main/js/Home";
//
// function App() {
//     const [isCheckHeader, setIsCheckHeader] = useState("아직 안바뀜");
//
//     function ChangeEventHandler(text) {
//         setIsCheckHeader(text);
//     }
//
//     return (
//         <div className="App" style={{ overflow: "hidden" }}>
//             <BrowserRouter>
//                 <Header isCheckHeader={isCheckHeader} ChangeEventHandler={ChangeEventHandler} />
//                 <Routes>
//                     <Route path="Home" element={<Home isCheckHeader={isCheckHeader} />} />
//                     <Route path="/CaptCha" element={<CaptCha isCheckHeader={isCheckHeader} />} />
//
//                 </Routes>
//                 <Footer />
//             </BrowserRouter>
//         </div>
//     );
// }
//
// export default App;
//
// //<Route path="/CodeTool" element={<CodeTool isCheckHeader={isCheckHeader} />} />
//
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
import CaptCha from "./component/captcha/js/CaptCha";
import CodeTool from "./component/codetool/js/CodeTool";
import FeedBack from "./component/community/js/FeedBack";
import FeedBackWrite from "./component/community/js/FeedBack-write";
import FeedBackDetail from "./component/community/js/FeedBackDetail";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {useState} from "react"

function App() {
    const [isCheckHeader, setIsCheckHeader] = useState("True");

    function ChangeEventHandler(text) {
        setIsCheckHeader(text);
    }

    return (
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <BrowserRouter>
                <Header isCheckHeader={isCheckHeader} ChangeEventHandler={ChangeEventHandler} />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home isCheckHeader={isCheckHeader} />} />
                        <Route path="/captcha" element={<CaptCha isCheckHeader={isCheckHeader} />} />
                        <Route path="/codetool" element={<CodeTool isCheckHeader={isCheckHeader} />} />
                        <Route path="/feedback" element={<FeedBack isCheckHeader={isCheckHeader} />} />
                        <Route path="/feedback/write" element={<FeedBackWrite />} />
                        <Route path="/feedback/:id" element={<FeedBackDetail />} />
                        <Route path="/mypage" element={<Mypage isCheckHeader={isCheckHeader} />} />
                        <Route path="/mypage-edit" element={<MypageEdit />} />
                        <Route path="/signin" element={<SignIn isCheckHeader={isCheckHeader} />} />
                        <Route path="/signup" element={<SignUp isCheckHeader={isCheckHeader} />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;