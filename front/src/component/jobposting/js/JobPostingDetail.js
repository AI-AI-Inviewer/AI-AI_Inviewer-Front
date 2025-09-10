import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../scss/JobPostingDetail.scss";

const JobPostingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { job } = location.state || {};

    if (!job) {
        return (
            <div className="jobposting-detail-wrapper">
                <p>잘못된 접근입니다.</p>
                <button onClick={() => navigate("/jobposting")}>공고 목록으로 돌아가기</button>
            </div>
        );
    }

    return (
        <div className="jobposting-detail-wrapper">
            <button className="back-btn" onClick={() => navigate("/jobposting")}>
                ← 목록으로 돌아가기
            </button>
            <div className="jobposting-detail-card">
                <h2>{job.title}</h2>
                <h3>{job.company}</h3>
                <p><strong>위치:</strong> {job.location}</p>
                <p><strong>카테고리:</strong> {job.category}</p>
                <p><strong>등록일:</strong> {job.date}</p>
                <hr />
                <p>
                    {/* 상세 설명 샘플 */}
                    {job.description || "상세 내용이 없습니다. 여기에 회사 소개, 직무 설명, 자격 요건 등을 작성하세요."}
                </p>
                <button className="apply-btn">
                    지원하기
                </button>
            </div>
        </div>
    );
};

export default JobPostingDetail;
