import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";
import Header from "./component/header/js/Header";
import Footer from "./component/footer/js/Footer";
import Home from  "./component/main/js/Home"
import CaptCha from "./component/captcha/js/CaptCha";
import CodeTool from './component/codetool/js/CodeTool';
import NoticeBoard from './component/community/js/NoticeBoard';
import FeedBack from "./component/community/js/FeedBack";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
    const [isCheckHeader, setIsCheckHeader] = useState("True");

    function ChangeEventHandler(text) {
        setIsCheckHeader(text);
    }

    return (
        <div className="App" style={{ overflow: "hidden" }}>
            <BrowserRouter>
                <Header isCheckHeader={isCheckHeader} ChangeEventHandler={ChangeEventHandler} />
                <Routes>
                    <Route path="/Home" element={<Home isCheckHeader={isCheckHeader} />} />
                    <Route path="/CaptCha" element={<CaptCha isCheckHeader={isCheckHeader} />} />
                    <Route path="/CodeTool" element={<CodeTool isCheckHeader={isCheckHeader} />} />
                    <Route path="/Notice Board" element={<NoticeBoard isCheckHeader={isCheckHeader} />} />
                    <Route path="/Feed Back" element={<FeedBack isCheckHeader={isCheckHeader} />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;