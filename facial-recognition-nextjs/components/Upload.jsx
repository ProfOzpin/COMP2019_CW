"use client"

import React, { useState } from "react";
import styles from "../style";

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
        <section className={`flex ${styles.flexStart} items-center md:items-start md:flex-row flex-col ${styles.paddingY}`}>
            <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
                {uploadedImageUrl ? (
                    <div className="relative">
                        <img 
                            src={uploadedImageUrl} 
                            alt="Uploaded to Cloudflare R2" 
                            className="w-[100%] h-[100%] relative z-[5] rounded-lg shadow-lg" 
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                            ☁️ Hosted on R2
                        </div>
                    </div>
                ) : previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-[100%] h-[100%] relative z-[5] rounded-lg" 
                    />
                ) : (
                    showPlaceholder && (
                        <img 
                            src={card} 
                            alt="Upload placeholder" 
                            className="w-[100%] h-[100%] relative z-[5]" 
                        />
                    )
                )}
            </div>

            <div className={`flex-1 flex ${styles.flexStart} flex-col md:ml-10 ml-0 md:mt-0 mt-10`}>
                <h2 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full">
                    Upload to R2 CDN
                </h2>
                
                <div className="mt-5 mb-5">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-[470px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-gradient file:text-primary"
                    />
                </div>

                {selectedFile && (
                    <div className="mb-5">
                        <p className="font-poppins font-normal text-dimWhite text-[16px] mb-2">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                        
                        <div className="flex gap-4">
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="py-3 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none disabled:opacity-50"
                            >
                                {loading ? "Uploading..." : "Upload to R2 & Analyze"}
                            </button>
                            
                            <button
                                onClick={handleReset}
                                className="py-3 px-6 font-poppins font-medium text-[18px] text-white border border-white rounded-[10px] outline-none hover:bg-white hover:text-primary transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                {loading && uploadProgress > 0 && (
                    <div className="mb-5 max-w-[470px]">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="font-poppins font-normal text-dimWhite text-[14px] mt-2">
                            {uploadProgress}% uploaded
                        </p>
                    </div>
                )}

                <h2 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full mt-10">
                    Results
                </h2>
                
                {!results && !loading && (
                    <p className="font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-[470px] mt-5">
                        Upload an image to Cloudflare R2 CDN and get facial recognition results!
                    </p>
                )}
                
                {loading && (
                    <p className="font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-[470px] mt-5">
                        Uploading to Cloudflare R2 and processing with AI...
                    </p>
                )}
                
                {results && (
                    <pre className="font-poppins font-normal text-dimWhite text-[14px] leading-[24px] max-w-[470px] mt-5 whitespace-pre-wrap bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
                        {results}
                    </pre>
                )}
            </div>
        </section>
    );
}

export default Upload;
