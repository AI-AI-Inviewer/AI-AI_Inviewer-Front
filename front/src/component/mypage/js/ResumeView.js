import { useState } from "react";
import { FaFileUpload, FaFilePdf, FaFileWord } from "react-icons/fa";
import "../scss/ResumeView.scss";

const ResumeView = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        // PDF/이미지 미리보기
        if (file.type === "application/pdf" || file.type.startsWith("image/")) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => setPreviewUrl(e.target.result);
            fileReader.readAsDataURL(file);
        } else {
            setPreviewUrl(null); // 미리보기 지원 안 하는 파일 형식
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("resume", selectedFile);

        try {
            // 예시 API 호출
            const response = await fetch("/api/upload/resume", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                alert("파일 업로드 성공!");
            } else {
                alert("업로드 실패");
            }
        } catch (err) {
            console.error(err);
            alert("업로드 중 오류 발생");
        }
    };

    return (
        <div className="resume-view">
            <h2>자기소개서 업로드</h2>
            <div className="upload-section">
                <label className="upload-button">
                    <FaFileUpload /> 파일 선택
                    <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" />
                </label>

                {selectedFile && (
                    <div className="file-info">
                        <p>선택한 파일: {selectedFile.name}</p>
                        {previewUrl && (
                            <div className="preview">
                                {selectedFile.type === "application/pdf" ? (
                                    <iframe src={previewUrl} title="pdf-preview" width="100%" height="400px"></iframe>
                                ) : (
                                    <img src={previewUrl} alt="preview" />
                                )}
                            </div>
                        )}
                        <button className="upload-btn" onClick={handleUpload}>
                            업로드
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeView;
