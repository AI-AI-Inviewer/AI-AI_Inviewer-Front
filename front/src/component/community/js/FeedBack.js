import React, { useEffect, useState } from 'react';
import '../scss/FeedBack.scss';
import { Link } from 'react-router-dom';
import { getFeedbackList } from '../../../api/feedback';


const FeedBack = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await getFeedbackList();  // API 호출
                setFeedbacks(data);
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
                    <li key={feedback.id} className="feedback-item">
                        <Link
                            to={`/feedback/${feedback.id}`}
                            state={feedback}
                            className="feedback-title-link"
                        >
                            <div className="feedback-title">{feedback.title}</div>
                            <div className="feedback-date">{feedback.date}</div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="feedback-btn-wrapper bottom">
                <Link
                    to="/feedback/write"
                    className="btn amado-btn"
                    style={{ marginBottom: '1rem', display: 'inline-block' }}
                >
                    글쓰기
                </Link>
            </div>
        </div>
    );
};

export default FeedBack;
