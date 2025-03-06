// ReelGenerator.js
import React, { useState } from 'react';
import axios from 'axios';
import ImageUploader from './ImageUploader';
import Loader from './Loader';

const ReelGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  const handleUpload = async (files) => {
    if (files.length === 0) {
      setGenerationStatus('Please select at least one image to upload.');
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image-${index}`, file);
    });

    try {
      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setGenerationStatus(`Reel generated successfully!`);
      } else {
        setGenerationStatus('Failed to generate reel. Please try again.');
      }
    } catch (error) {
      console.error('Error generating reel:', error);
      setGenerationStatus('An error occurred while generating the reel.');
    }

  };

  if (isGenerating) {
    return <Loader status={generationStatus} />;
  }

  return <ImageUploader onUpload={handleUpload} />;
};

export default ReelGenerator;