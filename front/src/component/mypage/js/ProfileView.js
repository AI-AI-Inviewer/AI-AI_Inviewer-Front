import pic from "../../imgs/profile.jpg";

const ProfileView = ({ userInfo, onGoToEdit }) => {
    return (
        <div className="profile-view">
            <h2 className="tab-title">내 프로필</h2>
            <div className="profile-card">
                <img src={pic} alt="프로필 이미지" className="profile-img" />

                <div className="profile-info-grid">
                    <div className="info-item">
                        <label>이름</label>
                        <p>{userInfo.userName || "..."}</p>
                    </div>
                    <div className="info-item">
                        <label>아이디</label>
                        <p>{userInfo.userId || "..."}</p>
                    </div>
                    <div className="info-item">
                        <label>닉네임</label>
                        <p>{userInfo.userNickname || "..."}</p>
                    </div>
                    <div className="info-item">
                        <label>이메일</label>
                        <p>{userInfo.userEmail || "..."}</p>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn-primary" onClick={onGoToEdit}>
                        정보 수정
                    </button>
                    <button className="btn-text" onClick={() => alert("회원 탈퇴 기능은 추후 구현 예정입니다.")}>
                        회원 탈퇴
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;