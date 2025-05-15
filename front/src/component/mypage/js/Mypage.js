import "../scss/Mypage.scss"
import "../../header/js/Header"
import Header from "../../header/js/Header";
import pic from '../../imgs/profile.jpg'

const Mypage= ()=> {
    return (
        <div className="App">
            <header className="App-header">
                <div className="d-flex align-items-start" id="sidebar">
                    <div className="nav flex-column nav-pills me-3" id="v-pills-tab " role="tablist"
                         aria-orientation="vertical">
                        <div className="sidebar">
                            <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill"
                                    data-bs-target="#v-pills-profile" type="button" role="tab"
                                    aria-controls="v-pills-profile" aria-selected="true">Profile
                            </button>
                            <button className="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                                    data-bs-target="#v-pills-bookmark" type="button" role="tab"
                                    aria-controls="v-pills-bookmark" aria-selected="false">Bookmark
                            </button>
                            <button className="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill"
                                    data-bs-target="#v-pills-messages" type="button" role="tab"
                                    aria-controls="v-pills-messages" aria-selected="false">Messages
                            </button>
                            <button className="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                                    data-bs-target="#v-pills-settings" type="button" role="tab"
                                    aria-controls="v-pills-settings" aria-selected="false">Settings
                            </button>
                        </div>
                    </div>

                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel"
                             aria-labelledby="v-pills-profile-tab" tabIndex="0">
                            <div className="profile">
                                <div className="profileItem">
                                    <img src={pic} alt='프로필 이미지' id="profileImg"/>
                                </div>
                                <div className="profileItem">
                                    <small>사용자명</small>
                                    <input type="text" className="form-control" id="txtName" value=""
                                           placeholder="사용자명 입력"/>
                                </div>
                                <div className="profileItem">
                                    <small>비밀번호</small>
                                    <input type="password" className="form-control" id="txtPwd" value=""
                                           placeholder="비밀번호 입력" required/>
                                </div>
                                <div className="profileItem">
                                    <small>이메일</small>
                                    <input type="email" className="form-control" id="txtMail" placeholder="이메일 입력"
                                           value=""/>
                                </div>
                                <div className="profileItem">
                                    <small>전화번호</small>
                                    <input type="email" className="form-control" id="txtPhone" placeholder="전화번호 입력"
                                           value=""/>
                                </div>
                                <div className="profileItem">
                                    <a id="editbtn" href="#" className="btn amado-btn">정보 수정</a>
                                    <a id="deletebtn" href="#" className="btn amado-btn">회원 탈퇴</a>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="v-pills-bookmark" role="tabpanel"
                             aria-labelledby="v-pills-bookmark-tab" tabIndex="0">
                            <h1>북마크 페이지</h1>
                        </div>
                        <div className="tab-pane fade" id="v-pills-messages" role="tabpanel"
                             aria-labelledby="v-pills-messages-tab" tabIndex="0">
                            <h1>메시지 페이지</h1>
                        </div>
                        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel"
                             aria-labelledby="v-pills-settings-tab" tabIndex="0">
                            <h1>설정 페이지</h1>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Mypage;