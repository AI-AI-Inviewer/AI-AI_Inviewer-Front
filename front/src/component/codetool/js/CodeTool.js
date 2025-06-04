import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useLocation, useNavigate } from 'react-router-dom';
import "../scss/CodeTool.scss";
import { githubLight } from '@uiw/codemirror-theme-github';

const CodeTool = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // location.state 에서 전달받은 initialCode 와 codeIndex를 받음
    const { initialCode = '// 코드를 입력하세요', codeIndex = null } = location.state || {};

    // localStorage에서 기존 저장된 코드 불러오기(있으면)
    const savedCode = codeIndex !== null ? localStorage.getItem(`code-${codeIndex}`) : null;

    const [code, setCode] = useState(savedCode || initialCode);

    const handleChange = (value) => {
        setCode(value);
    };

    // 저장 버튼 클릭 시 localStorage에 저장
    const handleSave = () => {
        if (codeIndex !== null) {
            localStorage.setItem(`code-${codeIndex}`, code);
            alert('코드가 저장되었습니다!');
        }
    };

    // 취소 버튼 클릭 시 CaptCha 페이지로 이동
    const handleCancel = () => {
        navigate('/codetool');
    };

    return (
        <div className="CT">
            <h2>CodeTool Pages</h2>
            <div className="code-editor">
                <CodeMirror
                    value={code}
                    height="400px"
                    extensions={[javascript()]}
                    onChange={handleChange}
                    theme={githubLight}
                />
            </div>
            <div className="preview">
                <h3>코드 미리보기</h3>
                <pre>{code}</pre>
            </div>
            <div className="buttons">
                <button className="save-btn" onClick={handleSave}>저장</button>
                <button className="cancel-btn" onClick={handleCancel}>취소</button>
            </div>
        </div>
    );
};

export default CodeTool;




