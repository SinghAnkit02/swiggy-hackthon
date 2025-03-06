import React, { useState, useEffect } from 'react';

const ImageUploader = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!selectedFiles) {
      setPreviews([]);
      return;
    }

    const objectUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
  };

  return (
    <div className="image-uploader">
      <h1>Multi-Image Uploader</h1>
      <div className="upload-container">
        <label htmlFor="file-input" className="file-input-label">
          Select Images
        </label>
        <input 
          id="file-input"
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange} 
        />
        <button onClick={handleUpload} className="upload-button">Generate Reel</button>
      </div>
      {previews.length > 0 && (
        <div className="image-previews">
          <h2>Selected Images:</h2>
          <div className="preview-container">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                <img src={preview} alt={`Preview ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;