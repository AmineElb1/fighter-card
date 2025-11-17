import React from 'react';
import useGameStore from '../../store/gameStore';
import { GamePhase } from '../../types/game';
import { useMultiplayerSync } from '../../hooks/useMultiplayerSync';
import './CompactCombatUI.css';

interface CompactCombatUIProps {
  onReturnToMenu?: () => void;
}

const CompactCombatUI: React.FC<CompactCombatUIProps> = ({ onReturnToMenu }) => {
  const { 
    gameState, 
    selectedCard, 
    playCard, 
    restartGame,
    isMultiplayer,
    myPlayerId
  } = useGameStore();
  
  const { multiplayerPlayCard } = useMultiplayerSync();

  if (!gameState) return null;

  const activePlayer = gameState.players.find(p => p.id === gameState.activePlayer);
  const opponent = gameState.players.find(p => p.id !== gameState.activePlayer);

  if (!activePlayer || !opponent) return null;

  // Check if it's this player's turn in multiplayer
  const isMyTurn = !isMultiplayer || (gameState.activePlayer === myPlayerId);

  const isGameOver = gameState.phase === GamePhase.VICTORY;
  const winner = gameState.players.find(p => p.fighter.health > 0);

  const card = selectedCard
    ? activePlayer.fighter.deck.find(c => c.id === selectedCard)
    : null;

  const handlePlayCard = () => {
    if (!card || isGameOver) return;

    const targetId = card.type === "attack" ? opponent.fighter.id : activePlayer.fighter.id;
    
    // Use multiplayer function if in multiplayer mode
    if (isMultiplayer) {
      console.log('🌐 [CompactUI] Playing card in multiplayer mode');
      multiplayerPlayCard(card.id, targetId);
    } else {
      console.log('🎮 [CompactUI] Playing card in solo mode');
      playCard(card.id, targetId);
    }
  };

  return (
    <div className="compact-combat-ui">
      
      {/* Game Over Screen */}
      {isGameOver && (
        <div className="compact-victory">
          <div className="victory-content">
            <h3>🏆 {winner?.name} Wins!</h3>
            <p>{winner?.fighter.name} is victorious</p>
            <div className="victory-actions">
              <button className="compact-btn restart" onClick={restartGame}>
                🔄 Rematch
              </button>
              {onReturnToMenu && (
                <button className="compact-btn menu" onClick={onReturnToMenu}>
                  🏠 Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Game UI */}
      {!isGameOver && (
        <>
          {/* Turn Info */}
          <div className="compact-info">
            <span className={`player-turn ${activePlayer.id === 'player1' ? 'player-blue' : 'player-red'}`}>
              {activePlayer.name}'s Turn
              {isMultiplayer && (isMyTurn ? ' (YOU)' : ' (OPPONENT)')}
            </span>
            <span className={`phase-label phase-${gameState.phase}`}>
              {gameState.phase === GamePhase.CARD_SELECTION && "Select Move"}
              {gameState.phase === GamePhase.COMBAT && "Executing..."}
              {gameState.phase === GamePhase.RESOLUTION && "Resolving..."}
            </span>
          </div>

          {/* Waiting for opponent message */}
          {isMultiplayer && !isMyTurn && gameState.phase === GamePhase.CARD_SELECTION && (
            <div className="compact-status waiting-opponent">
              ⏳ Waiting for opponent's move...
            </div>
          )}

          {/* Card Selection - Only show if it's your turn */}
          {gameState.phase === GamePhase.CARD_SELECTION && (!isMultiplayer || isMyTurn) && (
            <div className="compact-actions">
              {selectedCard && card ? (
                <>
                  <div className="selected-info">
                    <strong>Selected:</strong> {card.name}
                    <span className={`card-badge ${card.type}`}>
                      {card.type === 'attack' ? '⚔️ ATTACK' : '🛡️ DEFENSE'}
                    </span>
                  </div>
                  <button 
                    className="compact-btn play"
                    onClick={handlePlayCard}
                  >
                    Play Move →
                  </button>
                </>
              ) : (
                <div className="instruction">
                  👆 Select a card from your hand
                </div>
              )}
            </div>
          )}

          {/* Combat/Resolution Phases */}
          {(gameState.phase === GamePhase.COMBAT || gameState.phase === GamePhase.RESOLUTION) && (
            <div className="compact-status">
              {gameState.phase === GamePhase.COMBAT && "⚔️ Move in progress..."}
              {gameState.phase === GamePhase.RESOLUTION && "✓ Round complete"}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default CompactCombatUI;
