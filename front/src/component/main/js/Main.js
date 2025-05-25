import React from 'react';
import { Link } from 'react-router-dom';
import "../scss/Main.scss";

const Main = () => {

    return (
        <div className="homemain-container">
            <div className="homemainimg-container">
                <h2>Welcome to OpenCaptCha</h2>
                <p className="intro-text">
                    OpenCaptCha <br />
                    Sign up or Sign In
                </p>
                <div className="auth-buttons">
                    <Link to="/login" className="btn login-btn">로그인</Link>
                    <Link to="/signup" className="btn signup-btn">회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default Main;
