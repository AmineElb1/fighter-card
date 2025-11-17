import React, { useState } from 'react';
import StartMenu from './screens/StartMenu';
import LoadingScreen from './screens/LoadingScreen';
import MultiplayerLobby from './screens/MultiplayerLobby';
import GameScene3D from './3d/GameScene3D';

type GameScreen = 'START_MENU' | 'LOADING' | 'MULTIPLAYER_LOBBY' | 'FIGHTER_SELECTION' | 'COMBAT' | 'END_GAME' | 'SETTINGS';
type GameMode = 'solo' | 'multiplayer';

const GameManager: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('START_MENU');
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [multiplayerData, setMultiplayerData] = useState<{ roomId: string; playerId: string } | null>(null);

  const handlePlaySolo = () => {
    setGameMode('solo');
    // Show loading screen while models load
    setCurrentScreen('LOADING');
  };

  const handleLoadingComplete = () => {
    // After loading, go to combat
    // Later we'll add: setCurrentScreen('FIGHTER_SELECTION');
    setCurrentScreen('COMBAT');
  };

  const handlePlayOnline = () => {
    setGameMode('multiplayer');
    setCurrentScreen('MULTIPLAYER_LOBBY');
  };

  const handleStartMultiplayerGame = (roomId: string, playerId: string) => {
    setMultiplayerData({ roomId, playerId });
    // Go to loading screen first, then combat
    setCurrentScreen('LOADING');
  };

  const handleSettings = () => {
    console.log('Settings coming soon!');
    // setCurrentScreen('SETTINGS');
  };

  const handleReturnToMenu = () => {
    setCurrentScreen('START_MENU');
    setGameMode('solo');
    setMultiplayerData(null);
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

      {currentScreen === 'MULTIPLAYER_LOBBY' && (
        <MultiplayerLobby
          onBackToMenu={handleReturnToMenu}
          onStartGame={handleStartMultiplayerGame}
        />
      )}

      {currentScreen === 'LOADING' && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}

      {currentScreen === 'COMBAT' && (
        <GameScene3D 
          onReturnToMenu={handleReturnToMenu}
          gameMode={gameMode}
          multiplayerData={multiplayerData}
        />
      )}

      {/* Future screens */}
      {/* {currentScreen === 'FIGHTER_SELECTION' && <FighterSelection />} */}
      {/* {currentScreen === 'END_GAME' && <EndGameScreen />} */}
      {/* {currentScreen === 'SETTINGS' && <SettingsScreen />} */}
    </>
  );
};

export default GameManager;
