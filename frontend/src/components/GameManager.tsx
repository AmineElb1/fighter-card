import React, { useState } from 'react';
import StartMenu from './screens/StartMenu';
import LoadingScreen from './screens/LoadingScreen';
import GameScene3D from './3d/GameScene3D';

type GameScreen = 'START_MENU' | 'LOADING' | 'FIGHTER_SELECTION' | 'COMBAT' | 'END_GAME' | 'SETTINGS';

const GameManager: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('START_MENU');

  const handlePlaySolo = () => {
    // Show loading screen while models load
    setCurrentScreen('LOADING');
  };

  const handleLoadingComplete = () => {
    // After loading, go to combat
    // Later we'll add: setCurrentScreen('FIGHTER_SELECTION');
    setCurrentScreen('COMBAT');
  };

  const handlePlayOnline = () => {
    console.log('Online multiplayer coming soon!');
  };

  const handleSettings = () => {
    console.log('Settings coming soon!');
    // setCurrentScreen('SETTINGS');
  };

  const handleReturnToMenu = () => {
    setCurrentScreen('START_MENU');
  };

  return (
    <>
      {currentScreen === 'START_MENU' && (
        <StartMenu
          onPlaySolo={handlePlaySolo}
          onPlayOnline={handlePlayOnline}
          onSettings={handleSettings}
        />
      )}

      {currentScreen === 'LOADING' && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}

      {currentScreen === 'COMBAT' && (
        <GameScene3D onReturnToMenu={handleReturnToMenu} />
      )}

      {/* Future screens */}
      {/* {currentScreen === 'FIGHTER_SELECTION' && <FighterSelection />} */}
      {/* {currentScreen === 'END_GAME' && <EndGameScreen />} */}
      {/* {currentScreen === 'SETTINGS' && <SettingsScreen />} */}
    </>
  );
};

export default GameManager;
