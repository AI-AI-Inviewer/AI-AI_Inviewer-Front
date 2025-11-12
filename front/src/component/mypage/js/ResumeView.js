import { useMemo, useState, useCallback, useEffect } from "react";
import { FaUpload, FaFilePdf, FaFileWord, FaDownload, FaTrash } from "react-icons/fa";
import "../scss/ResumeView.scss";

const bytesFmt = (n) => {
    if (n == null) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0, x = Number(n);
    while (x >= 1024 && i < units.length - 1) { x /= 1024; i++; }
    return `${x.toFixed(x < 10 ? 2 : 1)} ${units[i]}`;
};

const dateFmt = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const z = (v) => String(v).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;
};

const ResumeView = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 로그인 후 이미 토큰이 로컬스토리지에 있으면 이 값으로 요청 보냄
    const token = useMemo(() => localStorage.getItem("accessToken"), []);

    const fetchList = useCallback(async () => {
        setLoadingList(true);
        try {
            const res = await fetch("/api/resumes", {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                credentials: "include",
            });
            if (!res.ok) throw new Error(`list failed: ${res.status}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setItems([]);
        } finally {
            setLoadingList(false);
        }
    }, [token]);

    // ✅ 처음 들어왔을 때 목록을 불러오도록
    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        if (file.type === "application/pdf" || file.type.startsWith("image/")) {
            const fr = new FileReader();
            fr.onload = (ev) => setPreviewUrl(ev.target.result);
            fr.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || uploading) return;

        const formData = new FormData();
        formData.append("resume", selectedFile);

        try {
            setUploading(true);
            const res = await fetch("/api/upload/resume", {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                body: formData,
                credentials: "include",
            });

            if (res.ok) {
                alert("파일 업로드 성공!");
                setSelectedFile(null);
                setPreviewUrl(null);
                await fetchList(); // 업로드 후 갱신
            } else if (res.status === 401) {
                alert("로그인이 필요합니다.");
            } else if (res.status === 413) {
                alert("파일이 너무 큽니다.");
            } else {
                const msg = await res.text().catch(() => "");
                alert(`업로드 실패 (${res.status}) ${msg}`);
            }
        } catch (err) {
            console.error(err);
            alert("업로드 중 오류 발생");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/resumes/${id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                credentials: "include",
            });
            if (res.status === 204) {
                setItems((prev) => prev.filter((x) => x.id !== id));
            } else if (res.status === 401) {
                alert("로그인이 필요합니다.");
            } else if (res.status === 403) {
                alert("삭제 권한이 없습니다.");
            } else if (res.status === 404) {
                alert("이미 삭제되었거나 없습니다.");
                fetchList();
            } else {
                const msg = await res.text().catch(() => "");
                alert(`삭제 실패 (${res.status}) ${msg}`);
            }
        } catch (e) {
            console.error(e);
            alert("삭제 중 오류 발생");
        }
    };

    const parseFilenameFromHeaders = (headers, fallback) => {
        const cd = headers.get("Content-Disposition") || headers.get("content-disposition");
        if (!cd) return fallback || "download.bin";
        const star = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(cd);
        if (star && star[1]) return decodeURIComponent(star[1]);
        const simple = /filename\s*=\s*"([^"]+)"/i.exec(cd);
        if (simple && simple[1]) return simple[1];
        return fallback || "download.bin";
    };

    const handleDownload = async (id, suggestedName) => {
        try {
            const res = await fetch(`/api/resumes/${id}/download`, {
                method: "GET",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                credentials: "include",
            });
            if (!res.ok) {
                if (res.status === 401) return alert("로그인이 필요합니다.");
                if (res.status === 403) return alert("다운로드 권한이 없습니다.");
                const msg = await res.text().catch(() => "");
                return alert(`다운로드 실패 (${res.status}) ${msg}`);
            }
            const blob = await res.blob();
            const name = parseFilenameFromHeaders(res.headers, suggestedName);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("다운로드 중 오류 발생");
        }
    };

    const fileIcon = (it) => {
        const ct = (it.contentType || "").toLowerCase();
        const name = (it.fileName || "").toLowerCase();
        if (ct.includes("pdf") || name.endsWith(".pdf")) return <FaFilePdf />;
        return <FaFileWord />;
    };

    return (
        <div className="resume-view">
            <h2>자기소개서 업로드</h2>

            <div className="upload-section">
                <label className="upload-button">
                    <FaUpload /> 파일 선택
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                </label>

                {selectedFile && (
                    <div className="file-info">
                        <p>선택한 파일: {selectedFile.name}</p>
                        {previewUrl && (
                            <div className="preview">
                                {selectedFile.type === "application/pdf" ? (
                                    <iframe
                                        src={previewUrl}
                                        title="pdf-preview"
                                        width="100%"
                                        height="340"
                                    />
                                ) : (
                                    <img src={previewUrl} alt="preview" />
                                )}
                            </div>
                        )}
                        <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
                            {uploading ? "업로드 중..." : "업로드"}
                        </button>
                    </div>
                )}
            </div>

            <hr />

            <div className="list-section">
                <h3>내 업로드 목록</h3>
                {loadingList ? (
                    <p>불러오는 중...</p>
                ) : items.length === 0 ? (
                    <p>업로드한 파일이 없습니다.</p>
                ) : (
                    <ul className="resume-list">
                        {items.map((it) => (
                            <li key={it.id} className="resume-item">
                                <div className="resume-meta">
                                    <div className="resume-file">
                                        <span className="resume-dot" />
                                        {fileIcon(it)} <span className="resume-name">{it.fileName}</span>
                                    </div>
                                    <small className="resume-sub">
                                        {bytesFmt(it.fileSize)} · {dateFmt(it.createdAt)}
                                    </small>
                                </div>

                                <div className="resume-actions">
                                    <button
                                        type="button"
                                        className="resume-btn resume-btn--primary"
                                        onClick={() => handleDownload(it.id, it.fileName)}
                                    >
                                        <FaDownload /> 다운로드
                                    </button>
                                    <button
                                        type="button"
                                        className="resume-btn resume-btn--danger"
                                        onClick={() => handleDelete(it.id)}
                                    >
                                        <FaTrash /> 삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ResumeView;
