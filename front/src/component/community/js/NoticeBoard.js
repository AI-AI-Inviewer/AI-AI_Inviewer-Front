import React from 'react';
import '../scss/NoticeBoard.scss';

const NoticeBoard = () => {
    const notices = [
        { id: 1, title: "OpenCaptCha 서비스 오픈 안내", date: "2025-05-28" },
        { id: 2, title: "회원가입 및 로그인 기능 점검 안내", date: "2025-06-01" },
        { id: 3, title: "보안 업데이트 공지", date: "2025-06-10" },
    ];

    return (
        <div className="notice-container">
            <h2>공지사항</h2>
            <ul className="notice-list">
                {notices.map(notice => (
                    <li key={notice.id} className="notice-item">
                        <div className="notice-title">{notice.title}</div>
                        <div className="notice-date">{notice.date}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NoticeBoard;
