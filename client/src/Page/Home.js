import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setSelectedFile(file);
      await handleUpload(file);
      stopCamera();
    }, 'image/jpeg');
  };

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="home-container">
      {showCamera ? (
        <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="camera-preview"
          />
          <div className="camera-controls">
            <button onClick={capturePhoto} className="capture-button">
              Capture Photo
            </button>
            <button onClick={stopCamera} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-section">
          <button 
            onClick={startCamera} 
            className="upload-button camera-button"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Open Camera'}
          </button>

          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="fileInput" 
            className="upload-button file-button"
          >
            {loading ? 'Uploading...' : 'Choose from Gallery'}
          </label>
        </div>
      )}
    </div>
  );
};

export default Home; 