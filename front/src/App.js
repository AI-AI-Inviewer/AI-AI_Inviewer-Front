import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Header from "./component/header/js/Header";
import CaptCha from "./component/CaptCha/js/CaptCha";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
    const [isCheckHeader, setIsCheckHeader] = useState("아직 안바뀜");

    function ChangeEventHandler(text) {
        setIsCheckHeader(text);
    }

    return (
        <div className="App" style={{ overflow: "hidden" }}>
            <BrowserRouter>
                <Header isCheckHeader={isCheckHeader} ChangeEventHandler={ChangeEventHandler} />
                <Routes>
                    <Route path="/CaptCha" element={<CaptCha isCheckHeader={isCheckHeader} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

