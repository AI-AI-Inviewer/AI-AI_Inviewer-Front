import { useEffect, useState } from 'react';

const BookmarkTab = () => {
    const [bookmarkedCompanies, setBookmarkedCompanies] = useState([]);

    useEffect(() => {
        const storedBookmarks = localStorage.getItem('bookmarks');
        if (storedBookmarks) {
            setBookmarkedCompanies(JSON.parse(storedBookmarks));
        }
    }, []);

    return (
        <div className="tab-pane fade show active" id="v-pills-bookmark" role="tabpanel">
            <h3>북마크한 기업</h3>
            {bookmarkedCompanies.length > 0 ? (
                <ul className="bookmark-list">
                    {bookmarkedCompanies.map((company, index) => (
                        <li key={index} className="bookmark-item">
                            ⭐ {company}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>북마크한 기업이 없습니다.</p>
            )}
        </div>
    );
};

export default BookmarkTab;
