import React, { useState, useEffect } from 'react'
import './Home.css'
import Polaroid from '../components/poloroid'

const Home = () => {
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    // Load the latest image path from localStorage on component mount
    const savedImage = localStorage.getItem('savedImage')
    if (savedImage) {
      setImageUrl(savedImage) // Restore the saved image URL
    }
  }, [])

  const handleFileInput = (event) => {
    const file = event.target.files[0]
    if (file) {
      const objectURL = URL.createObjectURL(file) // Generate temporary file URL

      // Store only the file URL (not Base64) to prevent quota issues
      setImageUrl(objectURL)
      localStorage.setItem('savedImage', objectURL) 
    }
  }

  return (
    <div className="home-container">
      <div className="polaroid-gallery">
        <Polaroid imageUrl={imageUrl} />
      </div>

      <div className="upload-section">
        <button
          onClick={() => document.getElementById('fileInput').click()}
          className="upload-button"
        >
          Select Image
        </button>

        <input
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default Home
