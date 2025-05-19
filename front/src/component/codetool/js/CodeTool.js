import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import '../scss/CodeTool.scss';

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
                    theme="light"
                />
            </div>
            <div className="preview">
                <h3>코드 미리보기</h3>
                <pre>{code}</pre>
            </div>
        </div>
    );
};

export default CodeTool;
