import React from "react";
import "../scss/BookmarkView.scss";

const BookmarkView = ({ bookmarks, setBookmarks }) => {
    const handleRemove = (name) => {
        setBookmarks(prev => prev.filter(n => n !== name));
    };

    return (
        <div className="bookmark-grid">
            {bookmarks.length > 0 ? (
                bookmarks.map(name => (
                    <div key={name} className="bookmark-card">
                        <div className="card-top">
                            <h3>{name}</h3>
                        </div>
                        <div className="card-bottom">
                            <button className="remove-btn" onClick={() => handleRemove(name)}>
                                삭제
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-bookmarks">북마크한 기업이 없습니다.</p>
            )}
        </div>
    );
};

export default BookmarkView;
