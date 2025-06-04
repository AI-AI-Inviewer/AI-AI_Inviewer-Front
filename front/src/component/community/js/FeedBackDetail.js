import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../scss/FeedBackDetail.scss';

const FeedBackDetail = () => {
    const location = useLocation();
    const feedback = location.state;

    // ✅ 로그인 사용자 정보 (예시)
    const currentUser = { username: 'gptuser' }; // 로그인 유저로 가정

    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');

    if (!feedback) {
        return (
            <div className="feedback-detail-container">
                <p className="not-found-msg">잘못된 접근입니다.</p>
                <Link to="/feedback" className="btn back-btn">← 목록으로</Link>
            </div>
        );
    }

    const formatTime = (date) => {
        return new Date(date).toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const handleAddComment = () => {
        if (!input.trim()) return;

        const newComment = {
            id: Date.now(),
            text: input,
            writer: currentUser.username,
            time: new Date().toISOString(),
        };

        setComments([newComment, ...comments]);
        setInput('');
    };

    const handleDelete = (id) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            setComments(comments.filter(c => c.id !== id));
        }
    };

    const handleEdit = (id, text) => {
        setEditingId(id);
        setEditingText(text);
    };

    const handleEditSubmit = () => {
        if (!editingText.trim()) return;
        setComments(comments.map(c =>
            c.id === editingId ? { ...c, text: editingText } : c
        ));
        setEditingId(null);
        setEditingText('');
    };

    return (
        <div className="feedback-detail-container">
            <h2 className="detail-title">{feedback.title}</h2>
            <p className="detail-date">{feedback.date}</p>
            <hr />
            <p className="detail-content">{feedback.content}</p>

            {currentUser.username === feedback.writer && (
                <div className="post-buttons">
                    <button className="btn edit-btn">게시글 수정</button>
                    <button
                        className="btn delete-btn"
                        onClick={() => {
                            if (window.confirm('게시글을 삭제하시겠습니까?')) {
                                alert("삭제되었습니다.");
                                // navigate('/feedback') 등 추가 가능
                            }
                        }}
                    >
                        게시글 삭제
                    </button>
                </div>
            )}

            <div className="comment-section">
                <h3>댓글</h3>
                <div className="comment-input">
          <textarea
              placeholder="댓글을 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
          />
                    <button onClick={handleAddComment}>등록</button>
                </div>

                <ul className="comment-list">
                    {comments.map((c) => (
                        <li key={c.id} className="comment-item">
                            <div className="comment-meta">
                                <strong>{c.writer}</strong>
                                <span className="comment-time">{formatTime(c.time)}</span>
                            </div>

                            {editingId === c.id ? (
                                <>
                  <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                  />
                                    <button onClick={handleEditSubmit}>저장</button>
                                    <button onClick={() => setEditingId(null)}>취소</button>
                                </>
                            ) : (
                                <>
                                    <p>{c.text}</p>
                                    {currentUser.username === c.writer && (
                                        <div className="comment-buttons">
                                            <button onClick={() => handleEdit(c.id, c.text)}>수정</button>
                                            <button onClick={() => handleDelete(c.id)}>삭제</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="btn-wrapper">
                <Link to="/feedback" className="btn back-btn">← 목록으로</Link>
            </div>
        </div>
    );
};

export default FeedBackDetail;
