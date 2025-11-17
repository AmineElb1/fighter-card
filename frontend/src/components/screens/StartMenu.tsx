import React from 'react';
import './StartMenu.css';

interface StartMenuProps {
  onPlaySolo: () => void;
  onPlayOnline: () => void;
  onSettings: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onPlaySolo, onPlayOnline, onSettings }) => {
  return (
    <div className="start-menu">
      <div className="background-animation">
        <div className="floating-particles"></div>
      </div>

      <div className="menu-container">
        {/* Game Title */}
        <div className="game-title">
          <h1 className="title-main">
            <span className="title-word">FIGHTER</span>
            <span className="title-word highlight">CARDS</span>
          </h1>
          <p className="subtitle">3D Turn-Based Combat</p>
        </div>

        {/* Menu Buttons */}
        <div className="menu-buttons">
          <button 
            className="menu-btn primary"
            onClick={onPlaySolo}
          >
            <span className="btn-icon">⚔️</span>
            <span className="btn-text">Play Solo</span>
            <span className="btn-subtitle">Fight against AI</span>
          </button>

          <button 
            className="menu-btn secondary"
            onClick={onPlayOnline}
          >
            <span className="btn-icon">🌐</span>
            <span className="btn-text">Play Online</span>
            <span className="btn-subtitle">Multiplayer Mode</span>
          </button>

          <button 
            className="menu-btn tertiary"
            onClick={onSettings}
          >
            <span className="btn-icon">⚙️</span>
            <span className="btn-text">Settings</span>
          </button>
        </div>

        {/* Footer */}
        <div className="menu-footer">
          <p>Made with React Three Fiber & TypeScript</p>
          <p className="version">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
