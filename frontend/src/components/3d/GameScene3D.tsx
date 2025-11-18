import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Grid } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Vector3 } from 'three';

import useGameStore from '../../store/gameStore';
import { useMultiplayerSync } from '../../hooks/useMultiplayerSync';
import Fighter3D from './Fighter3D';
import FighterFBXAnimated from './FighterFBXAnimated';
import CombatArena from './CombatArena';
import CardHand from './CardHand';
import LoadingFallback from './LoadingFallback';
import LoadingBox from './LoadingBox';
import CompactCombatUI from '../ui/CompactCombatUI';

interface GameScene3DProps {
  gameId?: string;
  onReturnToMenu?: () => void;
  gameMode?: 'solo' | 'multiplayer';
  multiplayerData?: { roomId: string; playerId: string } | null;
}

const GameScene3D: React.FC<GameScene3DProps> = ({ 
  gameId = 'game-1', 
  onReturnToMenu,
  gameMode = 'solo',
  multiplayerData = null 
}) => {
  const { 
    gameState, 
    initializeGame, 
    setSceneReady, 
    cameraPosition, 
    cameraTarget,
    error,
    setMultiplayerMode 
  } = useGameStore();

  // Initialize multiplayer sync
  useMultiplayerSync();

  // Set up multiplayer mode
  useEffect(() => {
    if (gameMode === 'multiplayer' && multiplayerData) {
      console.log('🌐 Setting up multiplayer mode:', multiplayerData);
      setMultiplayerMode(multiplayerData.roomId, multiplayerData.playerId);
    }
  }, [gameMode, multiplayerData, setMultiplayerMode]);

  useEffect(() => {
    if (!gameState) {
      initializeGame(gameId);
    }
  }, [gameId, gameState, initializeGame]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSceneReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setSceneReady]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading game</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!gameState) {
    return <LoadingFallback message="Initializing game..." />;
  }

  return (
    <div className="game-scene-container">
      
      <Canvas
        camera={{
          position: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
        style={{ height: '100vh', width: '100%' }}
      >

        {/* Global Lighting */}
        <ambientLight 
          color={gameState.arena.lighting.ambientColor} 
          intensity={gameState.arena.lighting.ambientIntensity} 
        />
        <directionalLight
          position={[
            gameState.arena.lighting.directionalPosition.x,
            gameState.arena.lighting.directionalPosition.y,
            gameState.arena.lighting.directionalPosition.z
          ]}
          color={gameState.arena.lighting.directionalColor}
          intensity={gameState.arena.lighting.directionalIntensity}
          castShadow={gameState.arena.lighting.shadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <Suspense fallback={null}>
          {/* Sky background - no HDR needed, faster loading */}
          <Sky 
            distance={450000}
            sunPosition={[10, 10, 5]}
            inclination={0}
            azimuth={0.25}
          />
        </Suspense>

        {/* Physics */}
        <Physics gravity={[0, -9.82, 0]}>
          
          {/* Arena */}
          <Suspense fallback={null}>
            <CombatArena arena={gameState.arena} />
          </Suspense>

          {/* Fighters */}
          {gameState.players.map((player) => {
            const isActivePlayer = player.id === gameState.activePlayer;
            const fighter = player.fighter;

            /** Ortiz (fighter1) */
            if (fighter.id === 'fighter1') {
              return (
                <Suspense key={fighter.id} fallback={<LoadingBox message="Loading Ortiz..." />}>
                  <FighterFBXAnimated
                    fighter={fighter}
                    isActive={isActivePlayer}
                    basePath="/models/fighters/ortiz/ortiz"
                    scale={0.04}
                  />
                </Suspense>
              );
            }

            /** Steve is nu NINJA → fighter2 */
            if (fighter.id === 'fighter2') {
              return (
                <Suspense key={fighter.id} fallback={<LoadingBox message="Loading Ninja..." />}>
                  <FighterFBXAnimated
                    fighter={fighter}
                    isActive={isActivePlayer}
                    basePath="/models/fighters/ninja/ninja"
                    scale={0.04}    // zelfde scale als Ortiz, werkt perfect
                  />
                </Suspense>
              );
            }

            /** Default placeholder */
            return (
              <Suspense key={fighter.id} fallback={<LoadingBox message="Loading fighter..." />}>
                <Fighter3D fighter={fighter} isActive={isActivePlayer} />
              </Suspense>
            );
          })}

          {/* Grid */}
          <Grid
            position={new Vector3(0, -0.01, 0)}
            args={[50, 50]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#666666"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#888888"
            fadeDistance={50}
            fadeStrength={1}
          />

        </Physics>

        {/* Camera Controls */}
        <OrbitControls
          target={[cameraTarget.x, cameraTarget.y, cameraTarget.z]}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />

      </Canvas>

      {/* UI */}
      <div className="ui-overlay">

        {/* Cards - Show player's own cards in multiplayer, or active player's cards in solo */}
        <CardHand 
          cards={gameMode === 'multiplayer' && multiplayerData
            ? gameState.players.find(p => p.id === multiplayerData.playerId)?.fighter.deck || []
            : gameState.players.find(p => p.id === gameState.activePlayer)?.fighter.deck || []}
          activePlayerId={gameState.activePlayer}
        />

        {/* Compact Combat UI - Under Cards */}
        <CompactCombatUI onReturnToMenu={onReturnToMenu} />

      </div>
    </div>
  );
};

export default GameScene3D;
