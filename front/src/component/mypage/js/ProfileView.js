import pic from "../../imgs/profile.jpg";
import { useState, useEffect } from "react";
import { updateUser, changePassword, logoutUser } from "../../../api/user";
import "../scss/ProfileView.scss"

/** 회원정보 수정 모달 */
const EditProfileModal = ({
                              open,
                              loading,
                              defaultValues,
                              onSubmit,
                              onClose,
                              onOpenPasswordModal, // ⬅ 비번 변경 모달 열기 콜백
                          }) => {
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (open) {
            setName(defaultValues?.userName ?? "");
            setNickname(defaultValues?.userNickname ?? "");
            setEmail(defaultValues?.userEmail ?? "");
            const onEsc = (e) => e.key === "Escape" && onClose();
            window.addEventListener("keydown", onEsc);
            return () => window.removeEventListener("keydown", onEsc);
        }
    }, [open, defaultValues, onClose]);

    if (!open) return null;

    const backdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !nickname.trim() || !email.trim()) {
            alert("모든 필드를 입력해 주세요.");
            return;
        }
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) {
            alert("올바른 이메일 형식을 입력해 주세요.");
            return;
        }
        onSubmit({
            userName: name.trim(),
            userNickname: nickname.trim(),
            userEmail: email.trim(),
        });
    };

    return (
        <div className="pv-modal-backdrop" onClick={backdropClick}>
            <div className="pv-modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
                <h5 id="edit-profile-title" className="pv-modal-title">회원 정보 수정</h5>

                <form className="pv-modal-body" onSubmit={handleSubmit}>
                    <label className="pv-form-label">
                        <small>이름</small>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                        />
                    </label>

                    <label className="pv-form-label">
                        <small>닉네임</small>
                        <input
                            type="text"
                            className="form-control"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            autoComplete="nickname"
                        />
                    </label>

                    <label className="pv-form-label">
                        <small>이메일</small>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </label>

                    <div className="pv-modal-actions" style={{ justifyContent: "space-between" }}>
                        <button
                            type="button"
                            className="pv-btn pv-danger"
                            onClick={onOpenPasswordModal}
                            disabled={loading}
                            title="비밀번호 변경 창을 엽니다."
                        >
                            비밀번호 변경
                        </button>

                        <div>
                            <button type="button" className="pv-btn pv-outline" onClick={onClose} disabled={loading}>
                                취소
                            </button>
                            <button type="submit" className="pv-btn pv-primary" disabled={loading}>
                                {loading ? "저장 중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

/** 비밀번호 변경 모달 */
const ChangePasswordModal = ({ open, loading, onSubmit, onClose }) => {
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
        <div className="pv-modal-backdrop" onClick={backdropClick}>
            <div className="pv-modal-card" role="dialog" aria-modal="true" aria-labelledby="pw-change-title">
                <h5 id="pw-change-title" className="pv-modal-title">비밀번호 변경</h5>

                <form className="pv-modal-body" onSubmit={handleSubmit}>
                    <label className="pv-form-label">
                        <small>현재 비밀번호</small>
                        <input
                            type="password"
                            className="form-control"
                            value={currentPw}
                            autoComplete="current-password"
                            onChange={(e) => setCurrentPw(e.target.value)}
                        />
                    </label>

                    <label className="pv-form-label">
                        <small>새 비밀번호</small>
                        <input
                            type="password"
                            className="form-control"
                            value={newPw}
                            autoComplete="new-password"
                            onChange={(e) => setNewPw(e.target.value)}
                        />
                    </label>

                    <label className="pv-form-label">
                        <small>새 비밀번호 확인</small>
                        <input
                            type="password"
                            className="form-control"
                            value={newPw2}
                            autoComplete="new-password"
                            onChange={(e) => setNewPw2(e.target.value)}
                        />
                    </label>

                    <div className="pv-modal-actions">
                        <button type="button" className="pv-btn pv-outline" onClick={onClose} disabled={loading}>
                            취소
                        </button>
                        <button type="submit" className="pv-btn pv-primary" disabled={loading}>
                            {loading ? "변경 중..." : "변경하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProfileView = ({ userInfo, onGoToEdit, onProfileUpdated }) => {
    const [me, setMe] = useState(userInfo || {});
    const [showEdit, setShowEdit] = useState(false);
    const [saving, setSaving] = useState(false);

    const [showPw, setShowPw] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);

    useEffect(() => { setMe(userInfo || {}); }, [userInfo]);

    const requireLogin = () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) { alert("로그인이 필요합니다."); return false; }
        return true;
    };

    const openEdit = () => {
        // if (onGoToEdit) return onGoToEdit(); // 페이지 이동 유지하려면 사용
        if (!requireLogin()) return;
        setShowEdit(true);
    };
    const closeEdit = () => setShowEdit(false);

    const handleUpdate = async (payload) => {
        try {
            setSaving(true);
            await updateUser(payload);
            alert("사용자 정보가 수정되었습니다.");
            const next = { ...me, userName: payload.userName, userNickname: payload.userNickname, userEmail: payload.userEmail };
            setMe(next);
            onProfileUpdated && onProfileUpdated(next);
            closeEdit();
        } catch (error) {
            console.error("사용자 정보 업데이트 실패:", error);
            const status = error?.response?.status;
            if (status === 401 || status === 403) alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
            else alert(error?.response?.data?.message ?? "정보 수정에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    const openPasswordModal = () => setShowPw(true);
    const closePasswordModal = () => setShowPw(false);

    const handleSubmitPassword = async ({ currentPassword, newPassword }) => {
        try {
            setPwLoading(true);
            await changePassword({ currentPassword, newPassword });

            // 표준 로그아웃 시도(실패해도 로컬 처리 진행)
            try { await logoutUser(); } catch (e) { /* ignore */ }
            localStorage.removeItem("jwtToken");

            alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
            setShowPw(false);
            setShowEdit(false);
            window.location.replace("/signin"); // 전체 리로드
        } catch (error) {
            console.error("비밀번호 변경 실패:", error);
            const status = error?.response?.status;
            if (status === 400) {
                alert(error?.response?.data?.message ?? "요청 형식이 올바르지 않습니다. (새 비밀번호 정책 확인)");
            } else if (status === 401 || status === 403) {
                alert("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
                window.location.replace("/signin");
            } else if (status === 409) {
                alert("현재 비밀번호가 올바르지 않습니다.");
            } else {
                alert(error?.response?.data?.message ?? "비밀번호 변경에 실패했습니다.");
            }
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <div className="profile-view">
            <h2 className="tab-title">내 프로필</h2>
            <div className="profile-card">
                <img src={pic} alt="프로필 이미지" className="profile-img" />

                <div className="profile-info-grid">
                    <div className="info-item"><label>이름</label><p>{me.userName || "..."}</p></div>
                    <div className="info-item"><label>아이디</label><p>{me.userId || "..."}</p></div>
                    <div className="info-item"><label>닉네임</label><p>{me.userNickname || "..."}</p></div>
                    <div className="info-item"><label>이메일</label><p>{me.userEmail || "..."}</p></div>
                </div>

                <div className="profile-actions">
                    <button className="btn-primary" onClick={openEdit}>정보 수정</button>
                    <button className="btn-text" onClick={() => alert("회원 탈퇴 기능은 추후 구현 예정입니다.")}>회원 탈퇴</button>
                </div>
            </div>

            {/* 회원정보 수정 모달 */}
            <EditProfileModal
                open={showEdit}
                loading={saving}
                defaultValues={me}
                onSubmit={handleUpdate}
                onClose={closeEdit}
                onOpenPasswordModal={openPasswordModal}
            />

            {/* 비밀번호 변경 모달 */}
            <ChangePasswordModal
                open={showPw}
                loading={pwLoading}
                onSubmit={handleSubmitPassword}
                onClose={closePasswordModal}
            />
        </div>
    );
};

export default ProfileView;