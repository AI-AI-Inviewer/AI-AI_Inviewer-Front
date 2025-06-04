import "../scss/Mypage-edit.scss"
import "../../header/js/Header"
import pic from '../../imgs/profile.jpg'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const MypageEdit= ()=> {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSave = () => {
        console.log("저장됨:", { name, password, email, phone });
        alert("수정된 정보를 저장했습니다.");

        navigate('/mypage');
    };

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
                                    aria-controls="v-pills-bookmark" aria-selected="false">즐찾
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
                                    <img src={pic} alt='프로필 이미지 수정' id="profileImg" />
                                </div>
                                <div className="profileItem">
                                    <small>사용자명</small>
                                    <input type="text" className="form-control" id="txtName" placeholder="사용자명 수정" value={name}
                                        onChange={(e) => setName(e.target.value)}/>
                                </div>
                                <div className="profileItem">
                                    <small>비밀번호</small>
                                    <input type="password" className="form-control" id="txtPwd" placeholder="비밀번호 수정" value={password}
                                        onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                <div className="profileItem">
                                    <small>이메일</small>
                                    <input type="email" className="form-control" id="txtMail" placeholder="이메일 수정" value={email}
                                        onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                <div className="profileItem">
                                    <small>전화번호</small>
                                    <input type="tel" className="form-control" id="txtPhone" placeholder="전화번호 수정" value={phone}
                                        onChange={(e) => setPhone(e.target.value)}/>
                                </div>
                                <div className="profileItem">
                                    <button id="editbtn" className="btn amado-btn" onClick={handleSave}>
                                        저장
                                    </button>
                                    <a id="deletebtn" href="#" className="btn amado-btn">취소하기</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default MypageEdit;