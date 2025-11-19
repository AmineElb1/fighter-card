import React, { useState } from 'react';
import './FighterSelection.css';

export interface FighterOption {
  id: string;
  name: string;
  displayName: string;
  portrait: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
  description: string;
  locked?: boolean;
}

interface FighterSelectionProps {
  onSelectionComplete: (player1FighterId: string, player2FighterId: string) => void;
  onBack: () => void;
  gameMode: 'solo' | 'multiplayer';
}

const FighterSelection: React.FC<FighterSelectionProps> = ({ 
  onSelectionComplete, 
  onBack,
  gameMode 
}) => {
  const [player1Selection, setPlayer1Selection] = useState<string | null>(null);
  const [player2Selection, setPlayer2Selection] = useState<string | null>(null);
  const [hoveredFighter, setHoveredFighter] = useState<FighterOption | null>(null);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);

  // Available fighters roster
  const fighters: FighterOption[] = [
    {
      id: 'ninja',
      name: 'Ninja',
      displayName: 'NINJA',
      portrait: '/ninja.png',
      stats: { attack: 80, defense: 75, speed: 85 },
      description: 'Swift ninja warrior with deadly precision',
    },
    {
      id: 'ortiz',
      name: 'Ortiz',
      displayName: 'ORTIZ',
      portrait: '/ortiz.png',
      stats: { attack: 85, defense: 80, speed: 75 },
      description: 'A fierce brawler with devastating attacks',
    },
    {
      id: 'boss',
      name: 'Boss',
      displayName: 'BOSS',
      portrait: '/boss.png',
      stats: { attack: 90, defense: 85, speed: 80 },
      description: 'The ultimate fighter with superior strength',
    },
    {
      id: 'steve',
      name: 'Steve',
      displayName: 'STEVE',
      portrait: '/steve.png',
      stats: { attack: 75, defense: 70, speed: 90 },
      description: 'Agile fighter with lightning-fast reflexes',
    },
  ];

  const handleFighterSelect = (fighterId: string, locked?: boolean) => {
    if (locked) return;

    if (gameMode === 'solo') {
      // In solo mode, player selects P1, then P2 (for bot)
      if (!player1Selection) {
        setPlayer1Selection(fighterId);
        setIsPlayer1Turn(false);
      } else if (!player2Selection && fighterId !== player1Selection) {
        setPlayer2Selection(fighterId);
      }
    } else {
      // In multiplayer, each player selects on their turn
      if (isPlayer1Turn && !player1Selection) {
        setPlayer1Selection(fighterId);
        setIsPlayer1Turn(false);
      } else if (!isPlayer1Turn && !player2Selection && fighterId !== player1Selection) {
        setPlayer2Selection(fighterId);
      }
    }
  };

  const handleConfirm = () => {
    if (player1Selection && player2Selection) {
      onSelectionComplete(player1Selection, player2Selection);
    }
  };

  const handleReset = () => {
    setPlayer1Selection(null);
    setPlayer2Selection(null);
    setIsPlayer1Turn(true);
  };

  const getSelectionStatus = () => {
    if (!player1Selection) {
      return gameMode === 'solo' ? 'SELECT YOUR FIGHTER' : 'PLAYER 1 - SELECT YOUR FIGHTER';
    }
    if (!player2Selection) {
      return gameMode === 'solo' ? 'SELECT OPPONENT FIGHTER' : 'PLAYER 2 - SELECT YOUR FIGHTER';
    }
    return 'READY TO FIGHT!';
  };

  return (
    <div className="fighter-selection">
      {/* Background */}
      <div className="selection-background">
        <div className="bg-gradient"></div>
        <div className="bg-particles"></div>
      </div>

      {/* Header */}
      <div className="selection-header">
        <button className="back-btn" onClick={onBack}>
          ← BACK
        </button>
        <h1 className="selection-title">CHOOSE YOUR FIGHTER</h1>
        <div className="selection-mode">{gameMode.toUpperCase()} MODE</div>
      </div>

      {/* Info Section - Shows fighter details OR VS matchup */}
      <div className="info-section">
        {player1Selection && player2Selection ? (
          /* VS Matchup when both selected */
          <div className="vs-matchup-container">
            <FighterInfoCompact 
              fighter={fighters.find(f => f.id === player1Selection)!} 
              label="PLAYER 1"
            />
            <div className="vs-text">VS</div>
            <FighterInfoCompact 
              fighter={fighters.find(f => f.id === player2Selection)!} 
              label="PLAYER 2"
            />
          </div>
        ) : (
          /* Fighter Details when selecting */
          <div className="fighter-details-center">
            {hoveredFighter ? (
              <div className="details-section">
                <FighterInfo fighter={hoveredFighter} />
              </div>
            ) : player1Selection ? (
              <div className="details-section">
                <h2>FIGHTER INFO</h2>
                <FighterInfo fighter={fighters.find(f => f.id === player1Selection)!} />
              </div>
            ) : (
              <div className="details-placeholder">
                <div className="placeholder-icon">👊</div>
                <p>Hover over a fighter to see details</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="selection-content">
        {/* Fighter Grid - Centered */}
        <div className="fighter-grid">
          {fighters.map((fighter) => {
            const isSelected = 
              player1Selection === fighter.id || player2Selection === fighter.id;
            const isPlayer1 = player1Selection === fighter.id;
            const isPlayer2 = player2Selection === fighter.id;

            return (
              <div
                key={fighter.id}
                className={`fighter-card ${isSelected ? 'selected' : ''} ${
                  fighter.locked ? 'locked' : ''
                } ${isPlayer1 ? 'player1' : ''} ${isPlayer2 ? 'player2' : ''}`}
                onClick={() => handleFighterSelect(fighter.id, fighter.locked)}
                onMouseEnter={() => !fighter.locked && setHoveredFighter(fighter)}
                onMouseLeave={() => setHoveredFighter(null)}
              >
                <div className="card-portrait">
                  <img 
                    src={fighter.portrait} 
                    alt={fighter.name}
                    onError={(e) => {
                      // Fallback for missing images
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3E%3F%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {fighter.locked && (
                    <div className="locked-overlay">
                      <span className="lock-icon">🔒</span>
                    </div>
                  )}
                  {isPlayer1 && <div className="player-indicator p1">P1</div>}
                  {isPlayer2 && <div className="player-indicator p2">P2</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Status and Controls */}
      <div className="selection-footer">
        <div className="selection-status">{getSelectionStatus()}</div>
        <div className="selection-controls">
          {(player1Selection || player2Selection) && (
            <button className="control-btn reset" onClick={handleReset}>
              RESET
            </button>
          )}
          {player1Selection && player2Selection && (
            <button className="control-btn confirm" onClick={handleConfirm}>
              START FIGHT! →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Fighter Info Component (detailed view)
const FighterInfo: React.FC<{ fighter: FighterOption }> = ({ fighter }) => (
  <div className="fighter-info">
    <h3 className="info-name">{fighter.displayName}</h3>
    <p className="info-description">{fighter.description}</p>
    <div className="info-stats">
      <div className="stat-bar">
        <span className="stat-label">Attack</span>
        <div className="stat-track">
          <div 
            className="stat-fill attack" 
            style={{ width: `${fighter.stats.attack}%` }}
          />
        </div>
        <span className="stat-value">{fighter.stats.attack}</span>
      </div>
      <div className="stat-bar">
        <span className="stat-label">Defense</span>
        <div className="stat-track">
          <div 
            className="stat-fill defense" 
            style={{ width: `${fighter.stats.defense}%` }}
          />
        </div>
        <span className="stat-value">{fighter.stats.defense}</span>
      </div>
      <div className="stat-bar">
        <span className="stat-label">Speed</span>
        <div className="stat-track">
          <div 
            className="stat-fill speed" 
            style={{ width: `${fighter.stats.speed}%` }}
          />
        </div>
        <span className="stat-value">{fighter.stats.speed}</span>
      </div>
    </div>
  </div>
);

// Compact Fighter Info (for VS screen)
const FighterInfoCompact: React.FC<{ fighter: FighterOption; label: string }> = ({ 
  fighter, 
  label 
}) => (
  <div className="fighter-info-compact">
    <div className="compact-label">{label}</div>
    <img 
      src={fighter.portrait} 
      alt={fighter.name}
      className="compact-portrait"
      onError={(e) => {
        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="30"%3E%3F%3C/text%3E%3C/svg%3E';
      }}
    />
    <h4 className="compact-name">{fighter.displayName}</h4>
  </div>
);

export default FighterSelection;
