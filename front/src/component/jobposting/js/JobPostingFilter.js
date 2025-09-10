import React from "react";

const categories = ["전체", "AI", "Web", "Platform", "Finance"];

const JobPostingFilter = ({ searchText, setSearchText, filteredCategory, setFilteredCategory }) => {
    return (
        <div className="jobposting-filter">
            <input
                type="text"
                placeholder="공고 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <select value={filteredCategory} onChange={(e) => setFilteredCategory(e.target.value)}>
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
    );
};

export default JobPostingFilter;
