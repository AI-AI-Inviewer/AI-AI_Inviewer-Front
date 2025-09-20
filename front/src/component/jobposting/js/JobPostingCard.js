import React from "react";
import "../scss/JobPostingCard.scss";
import { useNavigate } from "react-router-dom";

const JobPostingCard = ({ job }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/jobposting/${job.id}`, { state: { job } });
    };

    return (
        <div className="jobposting-card" /*onClick={handleClick}*/>
            <div className="jobposting-card-company">{job.company}</div>
            <div className="jobposting-card-info">
                <span>{job.location}</span>
                <button className="apply-btn" onClick={() => window.open(job.link)}>
                    지원하기
                </button>
            </div>
        </div>
    );
};

export default JobPostingCard;
