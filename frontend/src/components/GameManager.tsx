import React, { useState } from 'react';
import StartMenu from './screens/StartMenu';
import LoadingScreen from './screens/LoadingScreen';
import MultiplayerLobby from './screens/MultiplayerLobby';
import FighterSelection from './screens/FighterSelection';
import GameScene3D from './3d/GameScene3D';

type GameScreen = 'START_MENU' | 'LOADING' | 'MULTIPLAYER_LOBBY' | 'FIGHTER_SELECTION' | 'COMBAT' | 'END_GAME' | 'SETTINGS';
type GameMode = 'solo' | 'multiplayer';

const GameManager: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('START_MENU');
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [multiplayerData, setMultiplayerData] = useState<{ roomId: string; playerId: string } | null>(null);
  const [selectedFighters, setSelectedFighters] = useState<{ player1: string; player2: string } | null>(null);

  const handlePlaySolo = () => {
    setGameMode('solo');
    // Go directly to fighter selection
    setCurrentScreen('FIGHTER_SELECTION');
  };

  const handleLoadingComplete = () => {
    // After loading, go to combat
    setCurrentScreen('COMBAT');
  };

  const handleFighterSelection = (player1FighterId: string, player2FighterId: string) => {
    setSelectedFighters({ player1: player1FighterId, player2: player2FighterId });
    // Show loading screen while models load
    setCurrentScreen('LOADING');
  };

  const handlePlayOnline = () => {
    setGameMode('multiplayer');
    setCurrentScreen('MULTIPLAYER_LOBBY');
  };

  const handleStartMultiplayerGame = (roomId: string, playerId: string) => {
    setMultiplayerData({ roomId, playerId });
    // Go to fighter selection first in multiplayer too
    setCurrentScreen('FIGHTER_SELECTION');
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

      {currentScreen === 'FIGHTER_SELECTION' && (
        <FighterSelection
          onSelectionComplete={handleFighterSelection}
          onBack={handleReturnToMenu}
          gameMode={gameMode}
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
          selectedFighters={selectedFighters}
        />
      )}

      {/* Future screens */}
      {/* {currentScreen === 'END_GAME' && <EndGameScreen />} */}
      {/* {currentScreen === 'SETTINGS' && <SettingsScreen />} */}
    </>
  );
};

export default GameManager;
