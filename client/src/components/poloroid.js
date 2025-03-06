import '../App.css';
import dummyImage from '../images/dummy.jpg';  // You'll need to add this image to your project

function Polaroid() {
  // Example of dynamically changing styles
  const updateStyles = (color) => {
    document.documentElement.style.setProperty('--hashtag-color', color);
  };

  return (
    <div className="main-container">
      <div className="polaroid-container">
        <div className="polaroid">
          <img 
            src={dummyImage}
            alt="Dummy"
            className="polaroid-image" 
          />
          <div className="polaroid-caption">
            <span className="hashtag">#</span>
            <span className="caption-text">Beautiful Moment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Polaroid; 