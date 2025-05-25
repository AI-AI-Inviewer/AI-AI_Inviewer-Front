<<<<<<< HEAD
import React from 'react';
import '../scss/CaptCha.scss';

const CodeTool = () => {
    return (
        <div className="homemain-container">
            <div className="homemainimg-container">
                <h2>Home Page</h2>
            </div>
        </div>


=======
import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import "../scss/CodeTool.scss";
import { githubLight } from '@uiw/codemirror-theme-github';

const CodeTool = () => {
    const [code, setCode] = useState('// 코드를 입력하세요');

    const handleChange = (value) => {
        setCode(value);
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
        </div>
>>>>>>> 23261227d6cafc1f0d58454ab719260e5a4625ae
    );
};

export default CodeTool;
