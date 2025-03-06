import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    if (file) {
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
    }
  };

  return (
    <div className="home-container">
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <label htmlFor="imageInput" className="upload-button">
          {loading ? 'Uploading...' : 'Take Photo'}
        </label>
      </div>
    </div>
  );
};

export default Home;