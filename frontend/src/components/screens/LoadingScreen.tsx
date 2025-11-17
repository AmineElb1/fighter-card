import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const stages = [
      { progress: 20, text: 'Loading 3D Engine...' },
      { progress: 40, text: 'Loading Fighters...' },
      { progress: 60, text: 'Loading Animations...' },
      { progress: 80, text: 'Loading Arena...' },
      { progress: 95, text: 'Preparing Combat...' },
      { progress: 100, text: 'Ready!' }
    ];

    let currentStage = 0;

    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setLoadingText(stages[currentStage].text);
        currentStage++;
      } else {
        clearInterval(interval);
        // Wait a bit before calling completion
        setTimeout(() => {
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 500);
      }
    }, 600); // Each stage takes 600ms

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        
        {/* Logo/Title */}
        <div className="loading-title">
          <h2>FIGHTER CARDS</h2>
          <div className="loading-subtitle">3D Combat Arena</div>
        </div>

        {/* Loading Animation */}
        <div className="loading-animation">
          <div className="spinner">
            <div className="spinner-inner"></div>
            <div className="spinner-outer"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          {loadingText}
        </div>

        {/* Tips */}
        <div className="loading-tips">
          <p className="tip-label">💡 Tip:</p>
          <p className="tip-text">
            {progress < 30 && "Each fighter has unique attack and defense cards!"}
            {progress >= 30 && progress < 60 && "Watch your opponent's health bar above their head!"}
            {progress >= 60 && progress < 90 && "Defense cards reduce incoming damage for one turn!"}
            {progress >= 90 && "Time your attacks wisely to secure victory!"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
