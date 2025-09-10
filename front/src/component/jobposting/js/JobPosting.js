import React, { useState } from "react";
import JobPostingCard from "./JobPostingCard";
import JobPostingFilter from "./JobPostingFilter";
import "../scss/JobPosting.scss";

const sampleJobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "OpenAI",
        location: "Seoul",
        category: "AI",
        date: "2025-09-10",
    },
    {
        id: 2,
        title: "Backend Developer",
        company: "Google",
        location: "Seoul",
        category: "Web",
        date: "2025-09-09",
    },
];

const JobPosting = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredCategory, setFilteredCategory] = useState("전체");

    const filteredJobs = sampleJobs.filter(job => {
        const matchesCategory = filteredCategory === "전체" || job.category === filteredCategory;
        const matchesSearch = job.title.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="jobposting-wrapper">
            <aside className="jobposting-sidebar">
                <JobPostingFilter
                    searchText={searchText}
                    setSearchText={setSearchText}
                    filteredCategory={filteredCategory}
                    setFilteredCategory={setFilteredCategory}
                />
            </aside>
            <main className="jobposting-main">
                <h2>채용 공고</h2>
                {filteredJobs.length > 0 ? (
                    <div className="jobposting-grid">
                        {filteredJobs.map(job => (
                            <JobPostingCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>검색 결과가 없습니다.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobPosting;
