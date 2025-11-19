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
  selectedFighters?: { player1: string; player2: string } | null;
}

const GameScene3D: React.FC<GameScene3DProps> = ({ 
  gameId = 'game-1', 
  onReturnToMenu,
  gameMode = 'solo',
  multiplayerData = null,
  selectedFighters = null
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
      initializeGame(gameId, selectedFighters);
    }
  }, [gameId, gameState, initializeGame, selectedFighters]);

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
        shadows="soft"  // Softer, more realistic shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        style={{ height: '100vh', width: '100%' }}
      >

        {/* Enhanced Lighting Setup */}
        
        {/* Ambient - soft overall illumination */}
        <ambientLight 
          color="#ffffff" 
          intensity={0.4} 
        />
        
        {/* Hemisphere Light - sky/ground gradient for natural feel */}
        <hemisphereLight
          color="#87ceeb"    // sky color
          groundColor="#8b4513"  // ground color
          intensity={0.6}
          position={[0, 50, 0]}
        />

        {/* Main Directional Light (Sun) - primary shadows */}
        <directionalLight
          position={[10, 20, 10]}
          color="#fff5e6"
          intensity={1.2}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-bias={-0.0001}
        />

        {/* Rim Light - highlights fighters from behind */}
        <directionalLight
          position={[-5, 8, -10]}
          color="#ffa500"
          intensity={0.5}
        />

        {/* Fill Light - softens shadows */}
        <directionalLight
          position={[-10, 5, 5]}
          color="#add8e6"
          intensity={0.3}
        />

        {/* Spot Lights on fighters - dramatic effect */}
        <spotLight
          position={[-10, 15, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <spotLight
          position={[10, 15, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Point Lights for atmosphere - subtle glow */}
        <pointLight position={[0, 5, -15]} color="#ff6b6b" intensity={0.3} distance={20} />
        <pointLight position={[0, 5, 15]} color="#4ecdc4" intensity={0.3} distance={20} />

        <Suspense fallback={null}>
          {/* Enhanced Sky - dramatic sunset effect */}
          <Sky 
            distance={450000}
            sunPosition={[100, 20, 100]}  // Higher sun position for better lighting
            inclination={0.6}  // More dramatic angle
            azimuth={0.15}  // Adjust rotation
            turbidity={8}  // Atmospheric thickness
            rayleigh={2}  // Sky color intensity
            mieCoefficient={0.005}  // Haze amount
            mieDirectionalG={0.8}  // Sun glow
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
            
            console.log(`🎭 Rendering fighter: ${fighter.name} (ID: ${fighter.id})`);

            /** Ninja (fighter1) */
            if (fighter.id === 'fighter1') {
              console.log('✅ Loading Ninja with Ninja model');
              return (
                <Suspense key={fighter.id} fallback={<LoadingBox message="Loading Ninja..." />}>
                  <FighterFBXAnimated
                    fighter={fighter}
                    isActive={isActivePlayer}
                    basePath="/models/fighters/ninja/ninja"
                    scale={0.04}
                  />
                </Suspense>
              );
            }

            /** Ortiz (fighter2) */
            if (fighter.id === 'fighter2') {
              console.log('✅ Loading Ortiz model');
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

            /** Boss (fighter3) */
            if (fighter.id === 'fighter3') {
              return (
                <Suspense key={fighter.id} fallback={<LoadingBox message="Loading Boss..." />}>
                  <FighterFBXAnimated
                    fighter={fighter}
                    isActive={isActivePlayer}
                    basePath="/models/fighters/boss/boss"
                    scale={0.04}
                  />
                </Suspense>
              );
            }

            /** Steve (fighter4) */
            if (fighter.id === 'fighter4') {
              console.log('✅ Loading Steve model');
              return (
                <Suspense key={fighter.id} fallback={<LoadingBox message="Loading Steve..." />}>
                  <FighterFBXAnimated
                    fighter={fighter}
                    isActive={isActivePlayer}
                    basePath="/models/fighters/steve/steve"
                    scale={0.04}
                  />
                </Suspense>
              );
            }

            /** Default placeholder */
            console.warn(`⚠️ Unknown fighter ID: ${fighter.id}, using default`);
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
