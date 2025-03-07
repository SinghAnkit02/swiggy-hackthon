import React from 'react'
import '../App.css'

const Polaroid = ({ imageUrl }) => {

  return (
    <div className="mobile-container">
      <div className="polaroid-container">
        <div className="polaroid">
          <img 
            src={imageUrl || "https://plus.unsplash.com/premium_photo-1686030287375-2ca851ab0ae2?q=80&w=2272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            alt="Random"
            className="polaroid-image" 
          />
        </div>
      </div>
      
    </div>
  )
}

export default Polaroid