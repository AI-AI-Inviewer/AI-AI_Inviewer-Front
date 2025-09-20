import React, { useState } from "react";
import JobPostingCard from "./JobPostingCard";
import JobPostingFilter from "./JobPostingFilter";
import "../scss/JobPosting.scss";

const sampleJobs = [
    {
        id: 1,
        company: "Google",
        location: "해외",
        link: "https://www.incruit.com/company/1176521/job",
    },
    {
        id: 2,
        company: "Naver",
        location: "국내",
        link: "https://m.jobkorea.co.kr/start/groupagiguinlist/?G_ID=58&sort_type=2",
    },
    {
        id: 3,
        company: "Kakao",
        location: "국내",
        link: "https://careers.kakao.com/jobs?skillSet=&page=1&company=KAKAO&part=TECHNOLOGY&employeeType=&keyword=",
    },
    {
        id: 4,
        company: "Samsung",
        location: "국내",
        link: "https://www.samsungcareers.com/hr/",
    },
    {
        id: 5,
        company: "Microsoft",
        location: "해외",
        link: "https://www.catch.co.kr/Comp/RecruitInfo/600946",
    },
    {
        id: 6,
        company: "Oracle",
        location: "해외",
        link: "https://www.oracle.com/kr/careers/",
    },
];

const JobPosting = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredCategory, setFilteredCategory] = useState("전체");

    const filteredJobs = sampleJobs.filter(job => {
        const matchesCategory = filteredCategory === "전체" || job.location === filteredCategory;
        const matchesSearch = job.company.toLowerCase().includes(searchText.toLowerCase());
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
