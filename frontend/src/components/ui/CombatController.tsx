import React from 'react';
import useGameStore from '../../store/gameStore';
import { GamePhase } from '../../types/game';
import './CombatController.css';

const CombatController: React.FC = () => {
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

  /**
   * === AUTO PLAY LOGIC ===
   * - If attack → auto-target opponent
   * - If defense → auto-target self
   */
  const handlePlayCard = () => {
    if (!card || isGameOver) return;

    if (card.type === "attack") {
      playCard(card.id, opponent.fighter.id);
    } else {
      playCard(card.id, activePlayer.fighter.id);
    }
  };


  return (
    <div className="combat-controller">

      {/* === Turn Info === */}
      <div className="turn-info">
        <h2>Turn {gameState.currentTurn}</h2>

        <p className="active-player">
          <strong>{activePlayer.name}'s Turn</strong>
        </p>
      </div>

      {/* === Phase Indicator === */}
      <div className={`phase-badge phase-${gameState.phase}`}>
        {gameState.phase === GamePhase.CARD_SELECTION && "Select a Move"}
        {gameState.phase === GamePhase.COMBAT && "Executing Move"}
        {gameState.phase === GamePhase.RESOLUTION && "Resolving Round"}
        {gameState.phase === GamePhase.VICTORY && "Match Finished"}
      </div>

      {/* === Card Selection Phase === */}
      {gameState.phase === GamePhase.CARD_SELECTION && !isGameOver && (
        <div className="action-panel">
          {selectedCard && card ? (
            <>
              <p>Selected Move: <strong>{card.name}</strong></p>

              <p className="card-type-badge">
                {card.type === "attack" ? "Attack" : "Defense"}
              </p>

              <button 
                className="play-card-btn"
                onClick={handlePlayCard}
              >
                Play Move →
              </button>
            </>
          ) : (
            <div className="instruction">
              Select a move from your hand.
            </div>
          )}
        </div>
      )}

      {/* === Combat Phase === */}
      {gameState.phase === GamePhase.COMBAT && (
        <div className="combat-message">Executing move...</div>
      )}

      {/* === Resolution Phase === */}
      {gameState.phase === GamePhase.RESOLUTION && (
        <div className="resolution-panel">
          <p>Round resolved! ✓</p>
          <p className="next-turn-info">Switching turns...</p>
        </div>
      )}

      {/* === Victory Phase === */}
      {isGameOver && (
        <div className="victory-panel">
          <h2>Match Over</h2>

          {winner && (
            <div className="winner-announcement">
              <h3>{winner.name} Wins</h3>
              <p>{winner.fighter.name} dominated the fight.</p>

              <p className="final-health">
                Final HP: {winner.fighter.health}/{winner.fighter.maxHealth}
              </p>
            </div>
          )}

          <button 
            className="restart-btn"
            onClick={restartGame}
          >
            Restart Match
          </button>
        </div>
      )}

    </div>
  );
};

export default CombatController;
