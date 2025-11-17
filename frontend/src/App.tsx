// import React from 'react';
import GameScene3D from './components/3d/GameScene3D';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>Fighter Game 3D</h1>
          <p>3D Card-Based Fighting Platform</p>
        </header>
        
        <main className="app-main">
          <GameScene3D gameId="demo-game-1" />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App
