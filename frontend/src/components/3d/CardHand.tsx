import React from 'react';
import type { MoveCard3D } from '../../types/game';
import useGameStore from '../../store/gameStore';
import { useMultiplayerSync } from '../../hooks/useMultiplayerSync';
import './CardHand.css';

interface CardHandProps {
  cards: MoveCard3D[];
  activePlayerId: string;
}

const CardHand: React.FC<CardHandProps> = ({ cards }) => {
  const { 
    selectedCard, 
    selectCard, 
    playCard,
    gameState,
    isMultiplayer,
    myPlayerId
  } = useGameStore();
  
  const { multiplayerPlayCard } = useMultiplayerSync();

  // Check if it's this player's turn
  const isMyTurn = !isMultiplayer || (gameState?.activePlayer === myPlayerId);
  
  const handleCardClick = (card: MoveCard3D) => {
    // In multiplayer, only allow actions on your turn
    if (!isMyTurn) {
      console.log('⏳ Not your turn!');
      return;
    }

    if (selectedCard === card.id) {
      // Deselect if already selected
      selectCard(null);
    } else {
      // Select the card
      selectCard(card.id);
    }
  };

  const handlePlayCard = (card: MoveCard3D) => {
    console.log('🎴 handlePlayCard called for card:', card.id);
    console.log('🎴 isMyTurn:', isMyTurn);
    console.log('🎴 selectedCard:', selectedCard);
    console.log('🎴 isMultiplayer:', isMultiplayer);
    
    // In multiplayer, only allow actions on your turn
    if (!isMyTurn) {
      console.log('⏳ Not your turn!');
      return;
    }

    if (selectedCard === card.id) {
      console.log('✅ Card is selected, playing...');
      // Use multiplayer function if in multiplayer mode, otherwise use local
      if (isMultiplayer) {
        console.log('🌐 Playing card in multiplayer mode');
        multiplayerPlayCard(card.id);
      } else {
        console.log('🎮 Playing card in solo mode');
        playCard(card.id);
      }
    } else {
      console.log('❌ Card not selected:', selectedCard, '!==', card.id);
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
                  <div className="card-stat-badge">
                    <span className="stat-value">{card.damage}</span>
                  </div>
                </div>

                {/* Card Image Frame - Pokemon Style */}
                <div className="card-image">
                  {card.cardTexture && (
                    <img 
                      src={card.cardTexture} 
                      alt={card.name}
                      className="card-artwork"
                    />
                  )}
                  {!card.cardTexture && (
                    <div className="element-indicator" style={{ backgroundColor: card.glowColor }}>
                      {card.element.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Card Type Badge */}
                <div className={`card-type-badge ${card.type}`}>
                  {card.type === 'attack' ? 'ATTACK' : 'DEFENSE'}
                </div>
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