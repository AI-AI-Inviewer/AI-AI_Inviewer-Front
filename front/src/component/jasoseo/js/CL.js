import React, { useState } from 'react';
import '../scss/CL.scss';
import { Link } from 'react-router-dom';

const CL = () => {
    const cl = [
        {id: 1, title: "자소서 샘플1", content: "마케팅 직무 자소서 샘플입니다.", date: "2025-05-28", writer: "gptuser",
            /*image: "/assets/cl/sample1.png",*/
            file: "file/clfile1.pdf",
        },
        {id: 2, title: "자소서 샘플2", content: "기획 직무 자소서 샘플입니다.", date: "2025-06-01", writer: "gptuser",
            /*image: "/assets/cl/sample2.png",*/
            file: "file/clfile2.pdf",
        },
    ];

    return (
        <div className="cl-container">
            <h2>자소서 샘플</h2>
            <ul className="cl-list">
                {cl.map(cl => (
                    <li key={cl.id} className="cl-item">
                        <Link to={`/cl/${cl.id}`} state={cl} className="cl-title-link">
                            <div className="cl-title">{cl.title}</div>
                            <div className="cl-date">{cl.date}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CL;
