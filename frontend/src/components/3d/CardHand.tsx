import React from 'react';
import type { MoveCard3D } from '../../types/game';
import useGameStore from '../../store/gameStore';
import './CardHand.css';

interface CardHandProps {
  cards: MoveCard3D[];
  activePlayerId: string;
}

const CardHand: React.FC<CardHandProps> = ({ cards }) => {
  const { selectedCard, selectCard, playCard } = useGameStore();

  const handleCardClick = (card: MoveCard3D) => {
    if (selectedCard === card.id) {
      // Deselect if already selected
      selectCard(null);
    } else {
      // Select the card
      selectCard(card.id);
    }
  };

  const handlePlayCard = (card: MoveCard3D) => {
    if (selectedCard === card.id) {
      // For now, play without target (self-targeting or area effect)
      playCard(card.id);
    }
  };

  const getRarityColor = (rarity: string): string => {
    const colors = {
      common: '#888888',
      uncommon: '#44ff44',
      rare: '#4488ff',
      epic: '#aa44ff',
      legendary: '#ffaa44'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <div className="card-hand">
      <div className="card-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${selectedCard === card.id ? 'selected' : ''}`}
            onClick={() => handleCardClick(card)}
            onDoubleClick={() => handlePlayCard(card)}
            style={{
              '--rarity-color': getRarityColor(card.rarity),
              '--glow-color': card.glowColor,
              transform: `translateX(${index * 10}px) rotate(${(index - cards.length / 2) * 2}deg)`,
              zIndex: selectedCard === card.id ? 1000 : cards.length - index
            } as React.CSSProperties}
          >
            {/* Card Background */}
            <div className="card-background">
              <div className="card-border" />
              <div className="card-content">
                {/* Card Header */}
                <div className="card-header">
                  <h3 className="card-name">{card.name}</h3>
                  <div className="card-cost">{card.staminaCost}</div>
                </div>

                {/* Card Type Badge */}
                <div className={`card-type-badge ${card.type}`}>
                  {card.type === 'attack' ? '⚔️ ATTACK' : '🛡️ DEFENSE'}
                </div>

                {/* Card Image Placeholder */}
                <div className="card-image">
                  <div className="element-indicator" style={{ backgroundColor: card.glowColor }}>
                    {card.element.toUpperCase()}
                  </div>
                </div>

                {/* Card Stats */}
                <div className="card-stats">
                  {card.type === 'attack' && card.damage > 0 && (
                    <div className="stat damage">
                      <span className="stat-icon">⚔️</span>
                      <span className="stat-label">Damage</span>
                      <span className="stat-value">{card.damage}</span>
                    </div>
                  )}
                  {card.type === 'defense' && card.damage > 0 && (
                    <div className="stat defense">
                      <span className="stat-icon">🛡️</span>
                      <span className="stat-label">Block</span>
                      <span className="stat-value">{card.damage}</span>
                    </div>
                  )}
                  <div className="stat stamina">
                    <span className="stat-icon">⚡</span>
                    <span className="stat-label">Cost</span>
                    <span className="stat-value">{card.staminaCost}</span>
                  </div>
                </div>

                {/* Card Description */}
                <div className="card-description">
                  {card.description}
                </div>

                {/* Rarity Gem */}
                <div 
                  className="rarity-gem"
                  style={{ backgroundColor: getRarityColor(card.rarity) }}
                />
              </div>
            </div>

            {/* Selection Glow */}
            {selectedCard === card.id && (
              <div className="selection-glow" style={{ backgroundColor: card.glowColor }} />
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CardHand;