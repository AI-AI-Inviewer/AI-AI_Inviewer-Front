// src/component/cl/js/CLDetail.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../scss/CLDetail.scss';

const CLDetail = () => {
    const location = useLocation();
    const cl = location.state;

    if (!cl) {
        return (
            <div className="cl-detail-container">
                <p>잘못된 접근입니다.</p>
                <Link to="/cl" className="btn back-btn">← 목록으로</Link>
            </div>
        );
    }

    return (
        <div className="cl-detail-container">
            <h2 className="cl-detail-title">{cl.title}</h2>
            <p className="cl-detail-meta">
                작성자: {cl.writer} | 작성일: {cl.date}
            </p>

            <div className="cl-detail-content">{cl.content}</div>

            {cl.image && (
                <div className="cl-preview">
                    <img src={cl.image} alt="자기소개서 미리보기" />
                </div>
            )}

            {cl.file && (
                <div className="cl-download">
                    <a href={`/${cl.file}`} download className="btn download-btn">
                        다운로드
                    </a>
                </div>
            )}

            <div className="btn-wrapper">
                <Link to="/cl" className="btn back-btn">← 목록으로</Link>
            </div>
        </div>
    );
};

export default CLDetail;
