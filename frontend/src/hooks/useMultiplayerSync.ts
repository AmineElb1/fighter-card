import { useEffect } from 'react';
import { socketService } from '../services/socketService';
import useGameStore from '../store/gameStore';
import { GamePhase } from '../types/game';

/**
 * Hook to handle multiplayer game synchronization
 * Listens to socket events and syncs game state between players
 */
export const useMultiplayerSync = () => {
  const { 
    isMultiplayer, 
    myPlayerId,
    gameState,
    playCard: localPlayCard,
    endTurn: localEndTurn,
    updateFighterHealth,
    setGamePhase
  } = useGameStore();



  useEffect(() => {
    if (!isMultiplayer) return;

    console.log('🎮 Setting up multiplayer sync for player:', myPlayerId);
    console.log('📡 Socket connected:', socketService.isSocketConnected());
    console.log('📡 Socket ID:', socketService.getSocket()?.id);

    // Listen for opponent's card plays
    const cardPlayedHandler = (data: { playerId: string; cardId: string; targetId: string }) => {
      console.log('🎴 [EVENT RECEIVED] cardPlayed:', data);
      console.log('🎴 My player ID:', myPlayerId);
      console.log('🎴 Event player ID:', data.playerId);
      
      // Only process if it's not from us
      if (data.playerId !== myPlayerId) {
        console.log('🎴 Processing opponent card play locally');
        console.log('🎴 Playing opponent card for ANIMATION only');
        
        try {
          // Play the card locally to trigger animation
          // The actual damage/health will come from gameStateUpdate
          localPlayCard(data.cardId, data.targetId);
          console.log('🎴 Opponent card animation triggered');
        } catch (error) {
          console.error('❌ Error calling localPlayCard:', error);
        }
      } else {
        console.log('🎴 Ignoring my own card play event');
      }
    };
    
    socketService.onCardPlayed(cardPlayedHandler);
    console.log('✅ cardPlayed listener attached');

    // Listen for turn ending
    const turnEndedHandler = (data: { playerId: string }) => {
      console.log('⏭️  [EVENT RECEIVED] turnEnded by:', data.playerId);
      
      // Process for everyone (both players need to switch turn)
      localEndTurn();
    };
    
    socketService.onTurnEnded(turnEndedHandler);
    console.log('✅ turnEnded listener attached');

    // Listen for game state updates (health, phase changes, etc.)
    const gameStateUpdateHandler = (data: { gameState: unknown }) => {
      console.log('🔄 [EVENT RECEIVED] gameStateUpdate:', data);
      
      // Sync the game state
      if (data.gameState && typeof data.gameState === 'object') {
        const state = data.gameState as Record<string, unknown>;
        
        // Update fighter health
        if (Array.isArray(state.fighters)) {
          console.log('💊 Syncing fighter health:', state.fighters);
          state.fighters.forEach((fighter: unknown) => {
            const f = fighter as { id?: string; health?: number };
            if (f.id && typeof f.health === 'number') {
              console.log(`💊 Updating fighter ${f.id} health to ${f.health}`);
              updateFighterHealth(f.id, f.health);
            }
          });
        }
        
        // Update game phase
        if (typeof state.phase === 'string') {
          console.log(`📊 Updating phase to ${state.phase}`);
          setGamePhase(state.phase as GamePhase);
        }
        
        // Update active player if different
        if (typeof state.activePlayer === 'string') {
          const currentState = useGameStore.getState().gameState;
          if (currentState && currentState.activePlayer !== state.activePlayer) {
            console.log(`👤 Updating active player to ${state.activePlayer}`);
            // This will be handled by turn end event
          }
        }
      }
    };
    
    socketService.onGameStateUpdate(gameStateUpdateHandler);
    console.log('✅ gameStateUpdate listener attached');

    // Cleanup listeners on unmount
    return () => {
      socketService.off('cardPlayed');
      socketService.off('turnEnded');
      socketService.off('gameStateUpdate');
    };
  }, [isMultiplayer, myPlayerId, localPlayCard, localEndTurn, updateFighterHealth, setGamePhase]);

  // Return helper functions for multiplayer actions
  const multiplayerPlayCard = (cardId: string, targetId?: string) => {
    if (!isMultiplayer) {
      // Solo mode - just play locally
      localPlayCard(cardId, targetId);
      return;
    }

    // Multiplayer mode - send to server and play locally
    console.log('🌐 Sending card play to server:', { cardId, targetId });
    
    socketService.playCard(cardId, targetId || '')
      .then(() => {
        // Play locally after confirming with server
        localPlayCard(cardId, targetId);
        
        // After combat animation completes, sync the game state and end turn
        setTimeout(() => {
          const currentState = useGameStore.getState().gameState;
          if (currentState) {
            // First sync health and state
            const syncData = {
              fighters: currentState.players.map(p => ({
                id: p.fighter.id,
                health: p.fighter.health,
                position: { x: p.fighter.position.x, y: p.fighter.position.y, z: p.fighter.position.z }
              })),
              phase: currentState.phase,
              currentTurn: currentState.currentTurn,
              activePlayer: currentState.activePlayer
            };
            
            console.log('🔄 Syncing game state after my action:', syncData);
            socketService.syncGameState(syncData);
            
            // Then end turn (this will be received by both players)
            setTimeout(() => {
              if (currentState.phase !== 'victory') {
                console.log('⏭️ Sending end turn to server');
                socketService.endTurn();
              }
            }, 2000); // Wait for resolution phase
          }
        }, 2500); // Wait for combat animation to complete
      })
      .catch((err) => {
        console.error('❌ Failed to play card:', err);
      });
  };

  const multiplayerEndTurn = () => {
    if (!isMultiplayer) {
      // Solo mode - just end locally
      localEndTurn();
      return;
    }

    // Multiplayer mode - send to server and end locally
    console.log('🌐 Sending end turn to server');
    
    socketService.endTurn();
    localEndTurn();
    
    // Sync game state to opponent
    if (gameState) {
      const syncData = {
        fighters: gameState.players.map(p => ({
          id: p.fighter.id,
          health: p.fighter.health,
          position: p.fighter.position
        })),
        phase: gameState.phase,
        currentTurn: gameState.currentTurn,
        activePlayer: gameState.activePlayer
      };
      
      socketService.syncGameState(syncData);
    }
  };

  return {
    multiplayerPlayCard,
    multiplayerEndTurn
  };
};
