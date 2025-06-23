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
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowPlaceholder(false);
      setResults("");
      setUploadedImageUrl("");
      setFeedbackSent(false);
      setImageLoadError(false);
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
    setImageLoadError(false);

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

      console.log('Uploading to R2...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      // Check if response is ok and contains JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Response is not JSON:', responseText);
        throw new Error(`Expected JSON response, got: ${contentType}. Response: ${responseText}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);

      if (result.success) {
        // Enhanced URL validation and debugging
        console.log('Setting uploadedImageUrl to:', result.url);

        console.log('Setting uploadedImageUrl to:', result.url);
        setUploadedImageUrl(result.url);  
        // Send to Colab for analysis (Colab will handle MongoDB upsert)
        if (result.url) {
          setResults(prev => prev + "\n\n🔄 Analyzing image with AI...");
          
          try {
            const colabUrl = process.env.NEXT_PUBLIC_COLAB_API_URL?.replace(/\/$/, '');
            
            if (!colabUrl) {
              throw new Error('NEXT_PUBLIC_COLAB_API_URL not configured');
            }
            
            console.log('Calling Colab API:', colabUrl + '/recognize');
            
            // Call Colab API (this handles analysis AND MongoDB upsert)
            const colabResponse = await fetch(colabUrl + '/recognize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image_url: result.url }),
            });

            console.log('Colab response status:', colabResponse.status);

            if (colabResponse.ok) {
              const recognitionResults = await colabResponse.json();
              console.log('Recognition results from Colab:', recognitionResults);
              
              if (recognitionResults.success) {
                // Display results from Colab
                const { age, gender, emotion, emotion_confidence } = recognitionResults.result;
                setResults(prev => prev.replace(/🔄 Analyzing image with AI.*/, '') + 
                  "\n\n🔍 Facial Analysis Results:\n" +
                  "👤 Age: " + age + " years old\n" +
                  "⚧️ Gender: " + gender + "\n" +
                  "😊 Emotion: " + emotion + " (" + Math.round(emotion_confidence) + "% confidence)\n" +
                  "⏰ Processed at: " + recognitionResults.result.processedAt +
                  "\n\n💾 Results saved to database automatically"
                );
              } else {
                setResults(prev => prev.replace(/🔄 Analyzing image with AI.*/, '') + 
                  "\n\n❌ Analysis failed: " + (recognitionResults.error || 'Unknown error')
                );
              }
            } else {
              const errorText = await colabResponse.text();
              console.error('Colab API error response:', errorText);
              setResults(prev => prev.replace(/🔄 Analyzing image with AI.*/, '') + 
                "\n\n❌ Colab API error (" + colabResponse.status + "): " + errorText
              );
            }
          } catch (colabError) {
            console.error('Colab API error:', colabError);
            setResults(prev => prev.replace(/🔄 Analyzing image with AI.*/, '') + 
              "\n\n❌ Connection to AI failed: " + colabError.message
            );
          }
        }
      } else {
        setResults("❌ Upload failed: " + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResults("❌ Upload failed: " + error.message);
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
    setFeedbackSent(false);
    setImageLoadError(false);
  };

  const handleFeedback = async (isCorrect) => {
    try {
      console.log('Submitting feedback:', isCorrect, 'for URL:', uploadedImageUrl);
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          isCorrect: isCorrect
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setFeedbackSent(true);
          setResults(prev => prev + "\n\n✅ Feedback submitted successfully!");
        } else {
          setResults(prev => prev + "\n\n❌ Feedback failed: " + result.error);
        }
      } else {
        const errorText = await response.text();
        setResults(prev => prev + "\n\n❌ Feedback failed: " + errorText);
      }
    } catch (error) {
      console.error('Feedback error:', error);
      setResults(prev => prev + "\n\n❌ Feedback failed: " + error.message);
    }
  };

  // Enhanced image error handler
  const handleImageError = (e) => {
    console.error('Image failed to load:', e);
    console.error('Failed URL:', uploadedImageUrl);
    setImageLoadError(true);
    setResults(prev => prev + "\n\n⚠️ Warning: Uploaded image failed to display. URL may be incorrect or inaccessible.");
  };

  // Image load success handler
  const handleImageLoad = () => {
    console.log('Image loaded successfully:', uploadedImageUrl);
    setImageLoadError(false);
  };

  return (
    <section className="upload-section">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            {uploadProgress < 100 ? 'Uploading to R2...' : 'Running AI analysis...'}
          </div>
        </div>
      )}
      <div className="upload-image-col">
        {uploadedImageUrl && !imageLoadError ? (
          <div className="uploaded-image-container">
            <img
              src={uploadedImageUrl}
              alt="Uploaded to Cloudflare R2"
              className="uploaded-image"
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
            <div className="r2-badge">
              ☁️ Hosted on R2
            </div>
          </div>
        ) : uploadedImageUrl && imageLoadError ? (
          <div className="uploaded-image-container">
            <div className="image-error-placeholder" style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #d1d5db',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                <p>Image failed to load</p>
                <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                  URL: {uploadedImageUrl}
                </p>
              </div>
            </div>
            <div className="r2-badge" style={{ backgroundColor: '#ef4444' }}>
              ❌ Load Failed
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
                {loading ? "Processing..." : "Upload to R2 & Analyze"}
              </button>

              <button
                onClick={handleReset}
                className="reset-btn"
                disabled={loading}
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
              {uploadProgress < 100 ? `${uploadProgress}% uploaded` : 'Running AI analysis...'}
            </p>
          </div>
        )}

        <h2 className="upload-title results-title">
          Results
        </h2>

        {!results && !loading && (
          <p className="upload-results-placeholder">
            Upload an image to Cloudflare R2 CDN and get facial analytics results!
          </p>
        )}

        {loading && (
          <p className="upload-results-placeholder">
            {uploadProgress < 100 ? 'Uploading to Cloudflare R2...' : 'Running facial analysis with AI...'}
          </p>
        )}

        {results && (
          <pre className="upload-results-output">
            {results}
          </pre>
        )}

        {/* Debug info for troubleshooting */}
        {uploadedImageUrl && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
            <details>
              <summary>Debug Info (click to expand)</summary>
              <div style={{ marginTop: '8px', fontFamily: 'monospace' }}>
                <p><strong>Image URL:</strong> {uploadedImageUrl}</p>
                <p><strong>Load Error:</strong> {imageLoadError ? 'Yes' : 'No'}</p>
                <p><strong>URL Protocol:</strong> {uploadedImageUrl.startsWith('https://') ? 'HTTPS ✅' : 'HTTP ⚠️'}</p>
              </div>
            </details>
          </div>
        )}

        {/* Enhanced Feedback Section */}
        {results && uploadedImageUrl && !feedbackSent && results.includes('Facial Analysis Results') && !imageLoadError && (
          <div className="feedback-section">
            <p>Was the analysis accurate?</p>
            <div className="feedback-buttons">
              <button
                onClick={() => handleFeedback(true)}
                className="feedback-btn correct"
              >
                ✓ Correct
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="feedback-btn incorrect"
              >
                ✗ Incorrect
              </button>
            </div>
          </div>
        )}

        {feedbackSent && (
          <p style={{ color: "#10b981", marginTop: "1.2em", fontWeight: 600 }}>
            Thank you for your feedback!
          </p>
        )}
      </div>
    </section>
  );
}

export default Upload;
