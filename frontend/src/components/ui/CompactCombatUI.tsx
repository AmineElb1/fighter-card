import React from 'react';
import useGameStore from '../../store/gameStore';
import { GamePhase } from '../../types/game';
import './CompactCombatUI.css';

interface CompactCombatUIProps {
  onReturnToMenu?: () => void;
}

const CompactCombatUI: React.FC<CompactCombatUIProps> = ({ onReturnToMenu }) => {
  const { 
    gameState, 
    selectedCard, 
    playCard, 
    restartGame 
  } = useGameStore();

  if (!gameState) return null;

  const activePlayer = gameState.players.find(p => p.id === gameState.activePlayer);
  const opponent = gameState.players.find(p => p.id !== gameState.activePlayer);

  if (!activePlayer || !opponent) return null;

  const isGameOver = gameState.phase === GamePhase.VICTORY;
  const winner = gameState.players.find(p => p.fighter.health > 0);

  const card = selectedCard
    ? activePlayer.fighter.deck.find(c => c.id === selectedCard)
    : null;

  const handlePlayCard = () => {
    if (!card || isGameOver) return;

    if (card.type === "attack") {
      playCard(card.id, opponent.fighter.id);
    } else {
      playCard(card.id, activePlayer.fighter.id);
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
            </span>
            <span className={`phase-label phase-${gameState.phase}`}>
              {gameState.phase === GamePhase.CARD_SELECTION && "Select Move"}
              {gameState.phase === GamePhase.COMBAT && "Executing..."}
              {gameState.phase === GamePhase.RESOLUTION && "Resolving..."}
            </span>
          </div>

          {/* Card Selection */}
          {gameState.phase === GamePhase.CARD_SELECTION && (
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
