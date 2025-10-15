// src/component/mypage-edit/js/Mypage-edit.js
import "../scss/Mypage-edit.scss";
import pic from "../../imgs/profile.jpg";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { updateUser, changePassword, logoutUser } from "../../../api/user";

/** 비밀번호 변경 모달 */
const PasswordModal = ({ open, loading, onSubmit, onClose }) => {
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [newPw2, setNewPw2] = useState("");

    useEffect(() => {
        if (open) {
            setCurrentPw("");
            setNewPw("");
            setNewPw2("");
            const onEsc = (e) => e.key === "Escape" && onClose();
            window.addEventListener("keydown", onEsc);
            return () => window.removeEventListener("keydown", onEsc);
        }
    }, [open, onClose]);

    if (!open) return null;

    const backdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentPw || !newPw || !newPw2) {
            alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
            return;
        }
        if (newPw !== newPw2) {
            alert("새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        if (newPw.length < 8) {
            alert("새 비밀번호는 8자 이상이어야 합니다.");
            return;
        }
        if (currentPw === newPw) {
            alert("현재 비밀번호와 다른 새 비밀번호를 설정해주세요.");
            return;
        }
        onSubmit({ currentPassword: currentPw, newPassword: newPw });
    };

    return (
        <div className="modal-backdrop" onClick={backdropClick}>
            <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="pw-edit-title">
                <h5 id="pw-edit-title" className="modal-title">비밀번호 변경</h5>
                <form onSubmit={handleSubmit} className="modal-body">
                    <label className="form-label">
                        <small>현재 비밀번호</small>
                        <input
                            type="password"
                            className="form-control"
                            value={currentPw}
                            autoComplete="current-password"
                            onChange={(e) => setCurrentPw(e.target.value)}
                        />
                    </label>

                    <label className="form-label">
                        <small>새 비밀번호</small>
                        <input
                            type="password"
                            className="form-control"
                            value={newPw}
                            autoComplete="new-password"
                            onChange={(e) => setNewPw(e.target.value)}
                        />
                    </label>

                    <label className="form-label">
                        <small>새 비밀번호 확인</small>
                        <input
                            type="password"
                            className="form-control"
                            value={newPw2}
                            autoComplete="new-password"
                            onChange={(e) => setNewPw2(e.target.value)}
                        />
                    </label>

                    <div className="modal-actions">
                        <button type="button" className="btn amado-btn outline" onClick={onClose} disabled={loading}>
                            취소
                        </button>
                        <button type="submit" className="btn amado-btn danger" disabled={loading}>
                            {loading ? "변경 중..." : "변경하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MypageEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [pwChanging, setPwChanging] = useState(false);
    const [showPwModal, setShowPwModal] = useState(false);

    // state로 넘어온 값 우선, 없으면 /user/me 조회
    useEffect(() => {
        const ui = location.state?.userInfo;
        if (ui) {
            setUserName(ui.userName ?? "");
            setUserNickname(ui.userNickname ?? "");
            setUserEmail(ui.userEmail ?? "");
            return;
        }
        (async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    alert("로그인이 필요합니다.");
                    navigate("/signin");
                    return;
                }
                const { data } = await api.get("/user/me");
                setUserName(data.userName ?? "");
                setUserNickname(data.userNickname ?? "");
                setUserEmail(data.userEmail ?? "");
            } catch (error) {
                console.error("사용자 정보 불러오기 오류:", error);
                const status = error?.response?.status;
                if (status === 401 || status === 403) {
                    alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
                    navigate("/signin");
                } else {
                    alert(`사용자 정보를 불러오는데 실패했습니다. (${status || "네트워크 오류"})`);
                }
            }
        })();
    }, [location.state, navigate]);

    const requireLogin = () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/signin");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!requireLogin()) return;
        if (!userName.trim() || !userNickname.trim() || !userEmail.trim()) {
            alert("모든 필드를 입력해 주세요.");
            return;
        }
        try {
            setLoading(true);
            await updateUser({ userName, userNickname, userEmail });
            alert("사용자 정보가 수정되었습니다.");
            navigate("/mypage"); // 저장 후 마이페이지로 복귀
        } catch (error) {
            console.error("사용자 정보 업데이트 실패:", error);
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
                navigate("/signin");
            } else {
                const msg = error?.response?.data?.message ?? "정보 수정에 실패했습니다.";
                alert(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    // 비밀번호 변경 모달
    const handleOpenPwModal = () => {
        if (!requireLogin()) return;
        setShowPwModal(true);
    };
    const handleClosePwModal = () => setShowPwModal(false);

    const handleSubmitPassword = async ({ currentPassword, newPassword }) => {
        try {
            setPwChanging(true);
            await changePassword({ currentPassword, newPassword });

            // ✅ 비번 변경 성공 → 표준 로그아웃 API 호출로 세션/쿠키 정리
            try {
                await logoutUser(); // /api/user/logout, 실패해도 아래 로컬 처리로 이탈
            } catch (e) {
                console.warn("logoutUser failed (ignored):", e);
            }
            localStorage.removeItem("jwtToken"); // Authorization 헤더 차단

            alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
            setShowPwModal(false);
            window.location.replace("/signin"); // 전체 리로드로 상태 초기화
        } catch (error) {
            console.error("비밀번호 변경 실패:", error);
            const status = error?.response?.status;
            if (status === 400) {
                const msg =
                    error?.response?.data?.message ??
                    "요청 형식이 올바르지 않습니다. (새 비밀번호 정책 확인)";
                alert(msg);
            } else if (status === 401 || status === 403) {
                alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
                navigate("/signin");
            } else if (status === 409) {
                alert("현재 비밀번호가 올바르지 않습니다.");
            } else {
                const msg = error?.response?.data?.message ?? "비밀번호 변경에 실패했습니다.";
                alert(msg);
            }
        } finally {
            setPwChanging(false);
        }
    };

    const handleCancel = () => navigate("/mypage");

    return (
        <div className="mypage-container">
            <div className="d-flex">
                {/* 사이드바 */}
                <div className="sidebar">
                    <button className="nav-link active" onClick={() => {}}>
                        Edit
                    </button>
                    <button className="nav-link" onClick={() => navigate("/mypage")}>
                        Profile
                    </button>
                </div>

                {/* 메인 컨텐츠 카드 */}
                <div className="tab-content">
                    <div className="profile">
                        <img src={pic} alt="프로필 이미지" className="profile-img" />
                        <div className="profile-item">
                            <small>사용자명</small>
                            <input
                                type="text"
                                className="form-control"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="profile-item">
                            <small>닉네임</small>
                            <input
                                type="text"
                                className="form-control"
                                value={userNickname}
                                onChange={(e) => setUserNickname(e.target.value)}
                            />
                        </div>
                        <div className="profile-item">
                            <small>이메일</small>
                            <input
                                type="email"
                                className="form-control"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>

                        <div
                            className="profile-item"
                            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
                        >
                            <button
                                id="savebtn"
                                className="btn"
                                onClick={handleSave}
                                disabled={loading || pwChanging}
                            >
                                {loading ? "저장 중..." : "저장"}
                            </button>
                            <button
                                id="cancelbtn"
                                className="btn"
                                onClick={handleCancel}
                                disabled={loading || pwChanging}
                            >
                                취소
                            </button>
                            {/* 🔴 비밀번호 변경: 모달 호출 */}
                            <button
                                id="pwbtn"
                                className="btn"
                                onClick={handleOpenPwModal}
                                style={{ background: "#ef4444", color: "#fff" }}
                                disabled={loading || pwChanging}
                                title="비밀번호 변경 창을 엽니다."
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달 */}
            <PasswordModal
                open={showPwModal}
                loading={pwChanging}
                onSubmit={handleSubmitPassword}
                onClose={handleClosePwModal}
            />
        </div>
    );
};

export default MypageEdit;
