import React from 'react';
import '../scss/CL.scss';
import { Link } from 'react-router-dom';

const CL = () => {
    const cl = [
        {id: 1, title: "자소서 샘플1", content: "마케팅 직무 자소서 샘플입니다.", date: "2025-05-28", writer: "gptuser", file: "file/clfile1.pdf"},
        {id: 2, title: "자소서 샘플2", content: "기획 직무 자소서 샘플입니다.", date: "2025-06-01", writer: "gptuser", file: "file/clfile2.pdf"},
        {id: 3, title: "자소서 샘플3", content: "영업 직무 자소서 샘플입니다.", date: "2025-06-05", writer: "gptuser", file: "file/clfile3.pdf"},
        {id: 4, title: "자소서 샘플4", content: "디자인 직무 자소서 샘플입니다.", date: "2025-06-10", writer: "gptuser", file: "file/clfile4.pdf"},
        {id: 5, title: "자소서 샘플5", content: "개발 직무 자소서 샘플입니다.", date: "2025-06-15", writer: "gptuser", file: "file/clfile5.pdf"},
    ];

    return (
        <div className="cl-container">
            <h2>자소서 샘플</h2>
            <ul className="cl-list">
                {cl.map(item => (
                    <li key={item.id} className="cl-item">
                        <Link to={`/cl/${item.id}`} state={item} className="cl-card">
                            <div className="cl-title">{item.title}</div>
                            <div className="cl-date">{item.date}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CL;
