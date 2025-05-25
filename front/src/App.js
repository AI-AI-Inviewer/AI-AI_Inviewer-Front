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
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";
import Header from "./component/header/js/Header";
import Footer from "../src/component/footer/js/Footer";
import CaptCha from "../src/component/captcha/js/CaptCha";
import Home from "./component/main/js/Home";

function App() {
    const [isCheckHeader, setIsCheckHeader] = useState("아직 안바뀜");

    function ChangeEventHandler(text) {
        setIsCheckHeader(text);
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Header isCheckHeader={isCheckHeader} ChangeEventHandler={ChangeEventHandler} />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="Home" element={<Home isCheckHeader={isCheckHeader} />} />
                        <Route path="/CaptCha" element={<CaptCha isCheckHeader={isCheckHeader} />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
