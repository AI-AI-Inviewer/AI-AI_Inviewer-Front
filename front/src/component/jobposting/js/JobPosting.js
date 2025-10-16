import React, { useState } from "react";
import "../scss/JobPosting.scss";
import { sampleJobs } from "../data/sampleJobs";

const JobPosting = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredCategory, setFilteredCategory] = useState("전체");

    const filteredJobs = sampleJobs.filter(job => {
        const matchesCategory = filteredCategory === "전체" || job.location === filteredCategory;
        const matchesSearch = job.company.toLowerCase().includes(searchText.toLowerCase()) ||
            job.title.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="job-posting-wrapper">
            <div className="job-posting-container">
                {/* ✨ 헤더 섹션 삭제 */}

                {/* === 필터 컨트롤 === */}
                <div className="filter-controls">
                    <div className="search-box-wrapper">
                        <svg className="search-icon" viewBox="0 0 24 24"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A8 8 0 1 0 10 18zm0-14a6 6 0 1 1-6 6 6 6 0 0 1 6-6z"></path></svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="회사명 또는 포지션 검색"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="category-buttons">
                        <button className={filteredCategory === '전체' ? 'active' : ''} onClick={() => setFilteredCategory('전체')}>전체</button>
                        <button className={filteredCategory === '국내' ? 'active' : ''} onClick={() => setFilteredCategory('국내')}>국내</button>
                        <button className={filteredCategory === '해외' ? 'active' : ''} onClick={() => setFilteredCategory('해외')}>해외</button>
                    </div>
                </div>

                {/* === 검색 결과 카운트 === */}
                <div className="job-count">
                    총 <strong>{filteredJobs.length}</strong>개의 공고가 있습니다.
                </div>

                {/* === 채용 공고 그리드 === */}
                <div className="job-grid">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <a href={job.link} key={job.id} target="_blank" rel="noopener noreferrer" className="job-card-link">
                                <div className="job-card">
                                    <div className="job-card-header">
                                        <img src={job.logo} alt={`${job.company} logo`} className="company-logo" />
                                        <div className="company-info">
                                            <h3>{job.title}</h3>
                                            <p>{job.company}</p>
                                        </div>
                                    </div>
                                    <div className="job-card-tags">
                                        <span className="tag location">{job.location}</span>
                                        <span className="tag type">{job.type}</span>
                                        {job.tags.map(tag => (
                                            <span key={tag} className="tag skill">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </a>
                        ))
                    ) : (
                        <p className="no-result">검색 결과에 맞는 채용 공고가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobPosting;