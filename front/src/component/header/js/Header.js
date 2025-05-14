import "../scss/Header.scss";
import React, { useState } from "react";
import { Link } from "react-router-dom";  // Link 컴포넌트 임포트

const Header = ({ CheckHeader, ChangeEventHandler }) => {
    function onClickEventHome() {
        console.log(CheckHeader);
    }

    const [isCheckCaptCha, setIsCheckCaptCha] = useState("false");

    function onclickCaptCha() {
        ChangeEventHandler(isCheckCaptCha);
        setIsCheckCaptCha("true");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">OPENCAPTCHA</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/" onClick={onClickEventHome}>Home</a>
                        </li>
                        {/* Link 컴포넌트로 변경 */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/CaptCha" onClick={onclickCaptCha}>ChapCha</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">CodeTool</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                                COMMUNITY
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Notice Board</a></li>
                                <li><a className="dropdown-item" href="#">Feed Back</a></li>
                            </ul>
                        </li>
                    </ul>
                    <ul className="navbar-nav" id="login">
                        <li className="nav-item"><a className="nav-link" href="#">login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">sign up</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
