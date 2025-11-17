import { create } from 'zustand';
import { Vector3 } from 'three';
import type { 
  GameState3D, 
  Fighter3D, 
  MoveCard3D, 
  CombatAction3D
} from '../types/game';
import { 
  GamePhase,
  ElementType,
  CardRarity 
} from '../types/game';

interface GameStore {
  // Game State
  gameState: GameState3D | null;
  
  // UI State
  selectedCard: string | null;
  hoveredFighter: string | null;
  isLoading: boolean;
  error: string | null;
  
  // 3D Scene State
  cameraPosition: Vector3;
  cameraTarget: Vector3;
  sceneReady: boolean;
  
  // Animation Test State
  testAnimationState: 'idle' | 'punch' | 'kick' | 'block' | 'victory' | 'defeat';
  setTestAnimationState: (state: 'idle' | 'punch' | 'kick' | 'block' | 'victory' | 'defeat') => void;
  
  // Combat State - Track active animations per fighter
  fighterAnimations: Record<string, string>; // fighterId -> current animation
  setFighterAnimation: (fighterId: string, animation: string) => void;
  
  // Defense State - Track if a fighter is defending this turn
  defendingFighters: Record<string, number>; // fighterId -> defense amount
  
  // Actions
  initializeGame: (gameId: string) => void;
  selectCard: (cardId: string | null) => void;
  hoverFighter: (fighterId: string | null) => void;
  playCard: (cardId: string, targetId?: string) => void;
  updateCameraPosition: (position: Vector3, target: Vector3) => void;
  setSceneReady: (ready: boolean) => void;
  setError: (error: string | null) => void;
  
  // Fighter Actions
  createFighter: (fighterData: Partial<Fighter3D>) => Fighter3D;
  updateFighterPosition: (fighterId: string, position: Vector3) => void;
  updateFighterHealth: (fighterId: string, health: number) => void;
  
  // Combat Actions
  addCombatAction: (action: CombatAction3D) => void;
  processCombatActions: () => void;
  
  // Phase Management
  setGamePhase: (phase: GamePhase) => void;
  nextTurn: () => void;
  endTurn: () => void; // New: properly end a turn and switch players
  restartGame: () => void; // Restart the game with full health
}

// Default values - camera verder uitzoomen en hoger voor beter overzicht
const defaultCameraPosition = new Vector3(0, 8, 20);
const defaultCameraTarget = new Vector3(0, 3, 0);

const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  gameState: null,
  selectedCard: null,
  hoveredFighter: null,
  isLoading: false,
  error: null,
  cameraPosition: defaultCameraPosition,
  cameraTarget: defaultCameraTarget,
  sceneReady: false,
  testAnimationState: 'idle',
  fighterAnimations: {}, // Track current animation for each fighter
  defendingFighters: {}, // Track defense state for each fighter

  // Game Initialization
  initializeGame: (gameId: string) => {
    set({ isLoading: true, error: null });
    
    // Create mock game state for development
    const mockGameState: GameState3D = {
      gameId,
      phase: GamePhase.CARD_SELECTION, // Start with card selection
      currentTurn: 1,
      activePlayer: 'player1',
      players: [
        {
          id: 'player1',
          name: 'Player 1',
          avatar: '/avatars/player1.png',
          fighter: get().createFighter({
            id: 'fighter1',
            name: 'Ortiz',
            element: ElementType.FIRE,
            position: new Vector3(-5, 3, 0), // Ring base position
          }),
          isReady: false,
          wins: 0
        },
        {
          id: 'player2',
          name: 'Steve (Bot)',
          avatar: '/avatars/player2.png',
          fighter: get().createFighter({
            id: 'fighter2',
            name: 'Steve',
            element: ElementType.EARTH,
            position: new Vector3(5, 3, 0), // Ring base position (tegenover Ortiz)
          }),
          isReady: false,
          wins: 0
        }
      ],
      arena: {
        id: 'arena1',
        name: 'Elemental Battleground',
        environment: 'volcanic',
        skybox: '/skyboxes/volcanic.hdr',
        lighting: {
          ambientColor: '#404040',
          ambientIntensity: 0.3,
          directionalColor: '#ffffff',
          directionalIntensity: 1.0,
          directionalPosition: new Vector3(10, 10, 5),
          shadows: true
        },
        terrain: {
          texture: '/textures/volcanic-ground.jpg',
          normalMap: '/textures/volcanic-ground-normal.jpg',
          scale: new Vector3(50, 1, 50),
          physics: true
        },
        weather: {
          type: 'clear',
          intensity: 0,
          windDirection: new Vector3(1, 0, 0),
          windStrength: 0.1
        },
        boundaries: [
          new Vector3(-25, 0, -25),
          new Vector3(25, 0, -25),
          new Vector3(25, 0, 25),
          new Vector3(-25, 0, 25)
        ],
        spawnPoints: [
          new Vector3(-10, 0, 0),
          new Vector3(10, 0, 0)
        ],
        interactableObjects: []
      },
      combatActions: [],
      turnTimer: 30,
      cameraPosition: defaultCameraPosition,
      cameraTarget: defaultCameraTarget
    };
    
    set({ 
      gameState: mockGameState, 
      isLoading: false,
      cameraPosition: mockGameState.cameraPosition,
      cameraTarget: mockGameState.cameraTarget
    });
  },

  // UI Actions
  selectCard: (cardId: string | null) => {
    set({ selectedCard: cardId });
  },

  hoverFighter: (fighterId: string | null) => {
    set({ hoveredFighter: fighterId });
  },

  // Play a card - the main combat action
  playCard: (cardId: string, targetId?: string) => {
    const { gameState, selectedCard } = get();
    if (!gameState || !selectedCard) return;

    // Find the active player and their card
    const activePlayer = gameState.players.find(p => p.id === gameState.activePlayer);
    if (!activePlayer) return;

    const card = activePlayer.fighter.deck.find(c => c.id === cardId);
    if (!card) return;

    // For attack cards, we need a target
    if (card.type === 'attack' && !targetId) {
      console.error('Attack card requires a target');
      return;
    }

    // Create combat action
    const action: CombatAction3D = {
      id: `action_${Date.now()}`,
      type: card.type === 'attack' ? 'attack' : 'defend',
      source: activePlayer.fighter.id,
      target: targetId,
      card,
      sourcePosition: activePlayer.fighter.position.clone(),
      targetPosition: targetId ? 
        gameState.players.find(p => p.fighter.id === targetId)?.fighter.position.clone() 
        : undefined,
      timestamp: Date.now(),
      duration: 2000, // 2 seconds for animation
      damage: card.damage
    };

    // Add the action to the queue
    get().addCombatAction(action);
    
    // Clear selection
    set({ selectedCard: null });
    
    // Set the game phase to combat
    get().setGamePhase(GamePhase.COMBAT);
  },

  // 3D Scene Actions
  updateCameraPosition: (position: Vector3, target: Vector3) => {
    set({ 
      cameraPosition: position.clone(), 
      cameraTarget: target.clone() 
    });
  },

  setSceneReady: (ready: boolean) => {
    set({ sceneReady: ready });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setTestAnimationState: (state) => {
    set({ testAnimationState: state });
  },

  setFighterAnimation: (fighterId: string, animation: string) => {
    set((state) => ({
      fighterAnimations: {
        ...state.fighterAnimations,
        [fighterId]: animation
      }
    }));
  },

  // Fighter Management
  createFighter: (fighterData: Partial<Fighter3D>): Fighter3D => {
    const defaultFighter: Fighter3D = {
      id: fighterData.id || `fighter_${Date.now()}`,
      name: fighterData.name || 'Unknown Fighter',
      level: fighterData.level || 1,
      health: fighterData.health || 100,
      maxHealth: fighterData.maxHealth || 100,
      attack: fighterData.attack || 20,
      defense: fighterData.defense || 15,
      speed: fighterData.speed || 10,
      element: fighterData.element || ElementType.NEUTRAL,
      
      // 3D Properties
      position: fighterData.position || new Vector3(0, 0, 0),
      rotation: fighterData.rotation || new Vector3(0, 0, 0),
      scale: fighterData.scale || new Vector3(1, 1, 1),
      modelUrl: fighterData.modelUrl || '/models/default-fighter.glb',
      animationStates: fighterData.animationStates || [
        { name: 'idle', duration: 0, loop: true, blendMode: 'normal', weight: 1 },
        { name: 'attack', duration: 1000, loop: false, blendMode: 'normal', weight: 1 },
        { name: 'defend', duration: 500, loop: false, blendMode: 'normal', weight: 1 }
      ],
      
      // Combat Properties
      deck: fighterData.deck || createFighterDeck(fighterData.name || 'Unknown', fighterData.element || ElementType.NEUTRAL),
      currentStamina: fighterData.currentStamina || 100,
      maxStamina: fighterData.maxStamina || 100,
      statusEffects: fighterData.statusEffects || []
    };
    
    return defaultFighter;
  },

  updateFighterPosition: (fighterId: string, position: Vector3) => {
    const { gameState } = get();
    if (!gameState) return;

    const updatedPlayers = gameState.players.map(player => {
      if (player.fighter.id === fighterId) {
        return {
          ...player,
          fighter: {
            ...player.fighter,
            position: position.clone()
          }
        };
      }
      return player;
    });

    set({
      gameState: {
        ...gameState,
        players: updatedPlayers
      }
    });
  },

  updateFighterHealth: (fighterId: string, health: number) => {
    const { gameState } = get();
    if (!gameState) return;

    const updatedPlayers = gameState.players.map(player => {
      if (player.fighter.id === fighterId) {
        return {
          ...player,
          fighter: {
            ...player.fighter,
            health: Math.max(0, Math.min(health, player.fighter.maxHealth))
          }
        };
      }
      return player;
    });

    set({
      gameState: {
        ...gameState,
        players: updatedPlayers
      }
    });
  },

  // Combat System
  addCombatAction: (action: CombatAction3D) => {
    const { gameState } = get();
    if (!gameState) return;

    set({
      gameState: {
        ...gameState,
        combatActions: [...gameState.combatActions, action]
      }
    });

    // Process the action immediately
    setTimeout(() => {
      get().processCombatActions();
    }, 100);
  },

  // Process combat actions: handle damage, defense, animations
  processCombatActions: () => {
    const { gameState, defendingFighters, setFighterAnimation } = get();
    if (!gameState || gameState.combatActions.length === 0) return;

    // Process the first action in the queue
    const action = gameState.combatActions[0];
    
    console.log('🎮 Processing combat action:', action);
    console.log('🎮 All players:', gameState.players.map(p => ({ id: p.id, fighterId: p.fighter.id, name: p.fighter.name })));
    
    if (action.type === 'attack' && action.target && action.card && action.damage !== undefined) {
      // ATTACK CARD: Deal damage to target
      console.log('🎯 Looking for target with fighter.id:', action.target);
      const targetPlayer = gameState.players.find(p => p.fighter.id === action.target);
      const sourcePlayer = gameState.players.find(p => p.fighter.id === action.source);
      
      console.log('🎯 Found target player:', targetPlayer?.fighter.name);
      console.log('🎯 Found source player:', sourcePlayer?.fighter.name);
      
      if (targetPlayer && sourcePlayer) {
        // Trigger attacker animation based on card
        setFighterAnimation(action.source, action.card.castAnimation);
        
        // Calculate damage (with defense reduction if target is defending)
        let finalDamage = action.damage;
        const defenseAmount = defendingFighters[action.target] || 0;
        
        if (defenseAmount > 0) {
          // Target is defending: reduce damage
          finalDamage = Math.max(0, action.damage - defenseAmount);
          console.log(`⚔️ Attack reduced by defense! ${action.damage} → ${finalDamage}`);
        }
        
        // Apply damage to target
        const oldHealth = targetPlayer.fighter.health;
        const newHealth = Math.max(0, targetPlayer.fighter.health - finalDamage);
        console.log(`💊 Health update: ${oldHealth} → ${newHealth} (damage: ${finalDamage})`);
        
        // Update fighter health in the state
        const updatedPlayers = gameState.players.map(player => {
          if (player.fighter.id === action.target) {
            return {
              ...player,
              fighter: {
                ...player.fighter,
                health: newHealth
              }
            };
          }
          return player;
        });
        
        // Update gameState with new health AND remove the processed action
        set({
          gameState: {
            ...gameState,
            players: updatedPlayers,
            combatActions: gameState.combatActions.slice(1)
          }
        });
        
        console.log(`⚔️ ${sourcePlayer.fighter.name} attacks ${targetPlayer.fighter.name} for ${finalDamage} damage!`);
        console.log(`💊 New health should be: ${newHealth}`);
        
        // Reset animation after duration
        setTimeout(() => {
          setFighterAnimation(action.source, 'idle');
          
          // Check if target died
          if (newHealth <= 0 && action.target) {
            setFighterAnimation(action.target, 'defeat');
            setFighterAnimation(action.source, 'victory'); // Winner does victory animation
            get().setGamePhase(GamePhase.VICTORY);
            console.log(`💀 ${targetPlayer.fighter.name} has been defeated!`);
            console.log(`🎉 ${sourcePlayer.fighter.name} wins!`);
          }
        }, action.duration);
      }
      
    } else if (action.type === 'defend' && action.card && action.damage !== undefined) {
      // DEFENSE CARD: Set up defense for next incoming attack
      const sourcePlayer = gameState.players.find(p => p.fighter.id === action.source);
      
      if (sourcePlayer) {
        // Trigger defense animation
        setFighterAnimation(action.source, action.card.castAnimation);
        
        // Store defense amount for this fighter
        set((state) => ({
          defendingFighters: {
            ...state.defendingFighters,
            [action.source]: action.damage || 0 // For defense cards, damage = defense amount
          }
        }));
        
        // Remove processed action for defense
        set({
          gameState: {
            ...gameState,
            combatActions: gameState.combatActions.slice(1)
          }
        });
        
        console.log(`🛡️ ${sourcePlayer.fighter.name} is defending (blocks ${action.damage} damage)!`);
        
        // Reset animation after duration
        setTimeout(() => {
          setFighterAnimation(action.source, 'idle');
        }, action.duration);
      }
    } else {
      // Unknown action type - just remove it from queue
      set({
        gameState: {
          ...gameState,
          combatActions: gameState.combatActions.slice(1)
        }
      });
    }
    
    // After action is processed, wait for animation then move to resolution phase
    setTimeout(() => {
      const currentState = get().gameState;
      if (currentState && currentState.phase !== GamePhase.VICTORY) {
        get().setGamePhase(GamePhase.RESOLUTION);
        
        // Auto end turn after showing resolution message
        setTimeout(() => {
          const state = get().gameState;
          if (state && state.phase === GamePhase.RESOLUTION) {
            get().endTurn();
          }
        }, 1500); // Show resolution for 1.5 seconds
      }
    }, 2500);
  },

  // Phase Management
  setGamePhase: (phase: GamePhase) => {
    const { gameState } = get();
    if (!gameState) return;

    set({
      gameState: {
        ...gameState,
        phase
      }
    });
  },

  nextTurn: () => {
    const { gameState } = get();
    if (!gameState) return;

    const nextPlayer = gameState.players.find(p => p.id !== gameState.activePlayer);
    
    set({
      gameState: {
        ...gameState,
        currentTurn: gameState.currentTurn + 1,
        activePlayer: nextPlayer?.id || gameState.activePlayer,
        turnTimer: 30
      }
    });
  },

  // End current turn: clear defense buffs and switch to next player
  endTurn: () => {
    const { gameState } = get();
    if (!gameState) return;

    // Don't allow ending turn if game is over
    if (gameState.phase === GamePhase.VICTORY) {
      console.log('⚠️ Cannot end turn - game is over!');
      return;
    }

    // Find the next player
    const nextPlayer = gameState.players.find(p => p.id !== gameState.activePlayer);
    
    if (!nextPlayer) return;

    console.log(`🔄 Turn ${gameState.currentTurn} complete. Switching to ${nextPlayer.name}`);

    // Clear defense buffs (they only last for the turn they're played)
    set({ defendingFighters: {} });

    // Switch to next player
    set({
      gameState: {
        ...gameState,
        currentTurn: gameState.currentTurn + 1,
        activePlayer: nextPlayer.id,
        phase: GamePhase.CARD_SELECTION, // Back to card selection for new turn
        turnTimer: 30
      }
    });
  },

  // Restart game: reset all fighters to full health and start over
  restartGame: () => {
    const { gameState } = get();
    if (!gameState) return;

    console.log('🔄 Restarting game...');

    // Reset all fighters to full health
    const resetPlayers = gameState.players.map(player => ({
      ...player,
      fighter: {
        ...player.fighter,
        health: player.fighter.maxHealth
      }
    }));

    // Clear all combat state
    set({ 
      defendingFighters: {},
      fighterAnimations: {},
      selectedCard: null
    });

    // Reset game state
    set({
      gameState: {
        ...gameState,
        players: resetPlayers,
        currentTurn: 1,
        activePlayer: 'player1',
        phase: GamePhase.CARD_SELECTION,
        combatActions: [],
        turnTimer: 30
      }
    });
  }
}));

// Helper function to create fighter-specific deck - Each fighter has exactly 3 unique cards
function createFighterDeck(fighterName: string, element: ElementType): MoveCard3D[] {
  const elementColors = {
    [ElementType.FIRE]: '#ff4444',
    [ElementType.WATER]: '#4444ff',
    [ElementType.EARTH]: '#44ff44',
    [ElementType.AIR]: '#ffff44',
    [ElementType.LIGHTNING]: '#ff44ff',
    [ElementType.SHADOW]: '#444444',
    [ElementType.LIGHT]: '#ffffff',
    [ElementType.NEUTRAL]: '#888888'
  };

  const glowColor = elementColors[element];

  // Ortiz's deck (Fire element)
  if (fighterName === 'Ortiz') {
    const ortizCards: Omit<MoveCard3D, 'id' | 'element' | 'glowColor'>[] = [
      {
        name: 'Quick Strike',
        description: 'A fast punch attack',
        type: 'attack',
        damage: 20,
        staminaCost: 10,
        cooldown: 0,
        rarity: CardRarity.COMMON,
        castAnimation: 'punch',
        impactAnimation: 'hit',
        particleEffect: 'sparks',
        soundEffect: 'punch-hit',
        cardTexture: '/ortizPunch.png',
        cardPosition: new Vector3(0, 0, 0),
        cardRotation: new Vector3(0, 0, 0)
      },
      {
        name: 'Power Kick',
        description: 'A powerful kick attack',
        type: 'attack',
        damage: 35,
        staminaCost: 20,
        cooldown: 0,
        rarity: CardRarity.UNCOMMON,
        castAnimation: 'kick',
        impactAnimation: 'heavy-hit',
        particleEffect: 'energy-burst',
        soundEffect: 'kick-impact',
        cardTexture: '/ortizKick.png',
        cardPosition: new Vector3(0, 0, 0),
        cardRotation: new Vector3(0, 0, 0)
      },
      {
        name: 'Defensive Stance',
        description: 'Block and reduce incoming damage',
        type: 'defense',
        damage: 15,
        staminaCost: 10,
        cooldown: 0,
        rarity: CardRarity.COMMON,
        castAnimation: 'block',
        impactAnimation: 'block',
        particleEffect: 'shield',
        soundEffect: 'block-sound',
        cardTexture: '/ortizDefence.png',
        cardPosition: new Vector3(0, 0, 0),
        cardRotation: new Vector3(0, 0, 0)
      }
    ];

    return ortizCards.map((card, index) => ({
      ...card,
      id: `ortiz_card_${index}`,
      element,
      glowColor
    }));
  }

  // Steve (Ninja)'s deck (Earth element)
  if (fighterName === 'Steve') {
    const ninjaCards: Omit<MoveCard3D, 'id' | 'element' | 'glowColor'>[] = [
      {
        name: 'Shadow Punch',
        description: 'A swift ninja strike',
        type: 'attack',
        damage: 20,
        staminaCost: 10,
        cooldown: 0,
        rarity: CardRarity.COMMON,
        castAnimation: 'punch',
        impactAnimation: 'hit',
        particleEffect: 'sparks',
        soundEffect: 'punch-hit',
        cardTexture: '/ninjaPunch.png',
        cardPosition: new Vector3(0, 0, 0),
        cardRotation: new Vector3(0, 0, 0)
      },
      {
        name: 'Ninja Kick',
        description: 'A devastating kick',
        type: 'attack',
        damage: 35,
        staminaCost: 20,
        cooldown: 0,
        rarity: CardRarity.UNCOMMON,
        castAnimation: 'kick',
        impactAnimation: 'heavy-hit',
        particleEffect: 'energy-burst',
        soundEffect: 'kick-impact',
        cardTexture: '/ninjaKick.png',
        cardPosition: new Vector3(0, 0, 0),
        cardRotation: new Vector3(0, 0, 0)
      },
      {
        name: 'Shadow Guard',
        description: 'Block with ninja techniques',
        type: 'defense',
        damage: 15,
        staminaCost: 10,
        cooldown: 0,
        rarity: CardRarity.COMMON,
        castAnimation: 'block',
        impactAnimation: 'block',
        particleEffect: 'shield',
        soundEffect: 'block-sound',
        cardTexture: '/ninjaDefence.png',
        cardPosition: new Vector3(0, 0, 0),
        cardRotation: new Vector3(0, 0, 0)
      }
    ];

    return ninjaCards.map((card, index) => ({
      ...card,
      id: `ninja_card_${index}`,
      element,
      glowColor
    }));
  }

  // Default deck for unknown fighters
  const defaultCards: Omit<MoveCard3D, 'id' | 'element' | 'glowColor'>[] = [
    {
      name: 'Basic Attack',
      description: 'A simple attack',
      type: 'attack',
      damage: 20,
      staminaCost: 10,
      cooldown: 0,
      rarity: CardRarity.COMMON,
      castAnimation: 'punch',
      impactAnimation: 'hit',
      particleEffect: 'sparks',
      soundEffect: 'punch-hit',
      cardTexture: '',
      cardPosition: new Vector3(0, 0, 0),
      cardRotation: new Vector3(0, 0, 0)
    },
    {
      name: 'Strong Attack',
      description: 'A powerful attack',
      type: 'attack',
      damage: 35,
      staminaCost: 20,
      cooldown: 0,
      rarity: CardRarity.UNCOMMON,
      castAnimation: 'kick',
      impactAnimation: 'heavy-hit',
      particleEffect: 'energy-burst',
      soundEffect: 'kick-impact',
      cardTexture: '',
      cardPosition: new Vector3(0, 0, 0),
      cardRotation: new Vector3(0, 0, 0)
    },
    {
      name: 'Block',
      description: 'Reduce incoming damage',
      type: 'defense',
      damage: 15,
      staminaCost: 10,
      cooldown: 0,
      rarity: CardRarity.COMMON,
      castAnimation: 'block',
      impactAnimation: 'block',
      particleEffect: 'shield',
      soundEffect: 'block-sound',
      cardTexture: '',
      cardPosition: new Vector3(0, 0, 0),
      cardRotation: new Vector3(0, 0, 0)
    }
  ];

  return defaultCards.map((card, index) => ({
    ...card,
    id: `${element}_card_${index}`,
    element,
    glowColor
  }));
}

export default useGameStore;