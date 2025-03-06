import React, { useState, useEffect } from 'react';

const Loader = () => {
  const steps = [
    "Generating reel...",
    "Adding music...",
    "Finalizing...",
    "Almost done..."
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>{steps[currentStep]}</p>
    </div>
  );
};

export default Loader;
