import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PreloadAssets, usePreloadAssets } from '../../hooks/usePreloadAssets';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const { progress, isLoaded, loadingStage } = usePreloadAssets();

  useEffect(() => {
    if (isLoaded && onLoadingComplete) {
      const timer = setTimeout(() => {
        onLoadingComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, onLoadingComplete]);

  return (
    <>
      {/* Hidden Canvas for preloading assets */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <Canvas>
          <Suspense fallback={null}>
            <PreloadAssets />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading UI */}
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
            {loadingStage}
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
    </>
  );
};

export default LoadingScreen;
