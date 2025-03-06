import React from 'react'
import '../App.css'

const Poloriad = () => {
  const openCamera = () => {
    // Check if the device supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          // Handle the camera stream
          console.log('Camera opened successfully');
        })
        .catch(function(error) {
          console.error("Camera error: ", error);
        });
    } else {
      alert('Camera not supported on this device');
    }
  };

  return (
    <div className="mobile-container">
      <div className="polaroid-container">
        <div className="polaroid">
          <img 
            src="https://plus.unsplash.com/premium_photo-1686030287375-2ca851ab0ae2?q=80&w=2272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Random"
            className="polaroid-image" 
          />
        </div>
      </div>
      
    </div>
  )
}

export default Poloriad