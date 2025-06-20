"use client"

import React, { useState } from "react";
const card = "/assets/card.png";

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [results, setResults] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setShowPlaceholder(false);
            setResults("");
            setUploadedImageUrl("");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setResults("Please select a file first.");
            return;
        }

        setLoading(true);
        setUploadProgress(0);
        setResults("");

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();

            if (result.success) {
                setUploadedImageUrl(result.url);
                setResults(`✅ Upload successful!\n\nFile: ${result.filename}\nURL: ${result.url}`);
                
                if (result.recognition_results) {
                    setResults(prev => prev + `\n\n🔍 Facial Recognition Results:\n${JSON.stringify(result.recognition_results, null, 2)}`);
                }
            } else {
                setResults(`❌ Upload failed: ${result.error}`);
            }

        } catch (error) {
            console.error('Upload error:', error);
            setResults(`❌ Upload failed: ${error.message}`);
        } finally {
            setLoading(false);
            setTimeout(() => setUploadProgress(0), 2000);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setUploadedImageUrl("");
        setResults("");
        setShowPlaceholder(true);
        setUploadProgress(0);
    };

    return (
        <section className="upload-section">
            <div className="upload-image-col">
                {uploadedImageUrl ? (
                    <div className="uploaded-image-container">
                        <img 
                            src={uploadedImageUrl} 
                            alt="Uploaded to Cloudflare R2" 
                            className="uploaded-image" 
                        />
                        <div className="r2-badge">
                            ☁️ Hosted on R2
                        </div>
                    </div>
                ) : previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="uploaded-image"
                    />
                ) : (
                    showPlaceholder && (
                        <img 
                            src={card} 
                            alt="Upload placeholder" 
                            className="uploaded-image"
                        />
                    )
                )}
            </div>

            <div className="upload-form-col">
                <h2 className="upload-title">
                    Upload to R2 CDN
                </h2>
                
                <div className="upload-input-row">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="upload-input"
                    />
                </div>

                {selectedFile && (
                    <div className="upload-selected-file">
                        <p className="upload-selected-file-label">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                        
                        <div className="upload-btn-row">
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="upload-btn"
                            >
                                {loading ? "Uploading..." : "Upload to R2 & Analyze"}
                            </button>
                            
                            <button
                                onClick={handleReset}
                                className="reset-btn"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                {loading && uploadProgress > 0 && (
                    <div className="upload-progress-container">
                        <div className="upload-progress-bar-bg">
                            <div 
                                className="upload-progress-bar-fg"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="upload-progress-label">
                            {uploadProgress}% uploaded
                        </p>
                    </div>
                )}

                <h2 className="upload-title results-title">
                    Results
                </h2>
                
                {!results && !loading && (
                    <p className="upload-results-placeholder">
                        Upload an image to Cloudflare R2 CDN and get facial recognition results!
                    </p>
                )}
                
                {loading && (
                    <p className="upload-results-placeholder">
                        Uploading to Cloudflare R2 and processing with AI...
                    </p>
                )}
                
                {results && (
                    <pre className="upload-results-output">
                        {results}
                    </pre>
                )}
            </div>
        </section>
    );
}

export default Upload;
