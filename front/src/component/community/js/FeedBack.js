import React, { useEffect, useState } from 'react';
import '../scss/FeedBack.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeedBack = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:10000/api/community');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('피드백 불러오기 오류:', error);
                alert('피드백 목록을 불러오는데 실패했습니다.');
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="feedback-container">
            <h2>피드백 게시판</h2>
            <ul className="feedback-list">
                {feedbacks.map(feedback => (
                    <li key={feedback.communityNum} className="feedback-item">
                        <Link
                            to={`/feedback/${feedback.communityNum}`}
                            state={feedback}
                            className="feedback-title-link"
                        >
                            <div className="feedback-title">{feedback.communityTitle}</div>
                            <div className="feedback-date">
                                작성일: {new Date(feedback.communityDate).toLocaleDateString()}
                            </div>
                            <div className="feedback-views">
                                조회수: {feedback.communityViewCount}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            {token && (
                <div className="feedback-btn-wrapper bottom">
                    <Link
                        to="/feedback/write"
                        className="btn amado-btn"
                        style={{ marginBottom: '1rem', display: 'inline-block' }}
                    >
                        글쓰기
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FeedBack;
