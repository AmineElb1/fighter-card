import { Vector3 } from 'three';

// Core Fighter Types
export interface Fighter3D {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  element: ElementType;
  
  // 3D Properties
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  modelUrl: string;
  animationStates: AnimationState[];
  
  // Combat Properties
  deck: MoveCard3D[];
  currentStamina: number;
  maxStamina: number;
  statusEffects: StatusEffect[];
}

// Combat Card System
export interface MoveCard3D {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense'; // Card type: attack deals damage, defense reduces incoming damage
  damage: number; // For attack cards: damage dealt. For defense cards: damage reduction amount
  staminaCost: number;
  cooldown: number;
  element: ElementType;
  rarity: CardRarity;
  
  // 3D Animation Properties
  castAnimation: string; // Animation name to play (e.g., 'punch', 'kick', 'block')
  impactAnimation: string;
  particleEffect: string;
  soundEffect: string;
  
  // Card Visuals
  cardTexture: string;
  glowColor: string;
  cardPosition: Vector3;
  cardRotation: Vector3;
}

// 3D Arena System
export interface CombatArena3D {
  id: string;
  name: string;
  environment: string;
  
  // 3D Scene Properties
  skybox: string;
  lighting: LightingConfig;
  terrain: TerrainConfig;
  weather: WeatherEffect;
  
  // Combat Properties
  boundaries: Vector3[];
  spawnPoints: Vector3[];
  interactableObjects: ArenaObject[];
}

// Animation System
export interface AnimationState {
  name: string;
  duration: number;
  loop: boolean;
  blendMode: 'normal' | 'additive';
  weight: number;
}

// Combat Actions
export interface CombatAction3D {
  id: string;
  type: ActionType;
  source: string; // Fighter ID
  target?: string; // Fighter ID
  card?: MoveCard3D;
  
  // 3D Spatial Data
  sourcePosition: Vector3;
  targetPosition?: Vector3;
  trajectory?: Vector3[];
  
  // Timing
  timestamp: number;
  duration: number;
  
  // Effects
  damage?: number;
  healing?: number;
  statusEffects?: StatusEffect[];
}

// Type Constants (Modern TypeScript approach)
export const ElementType = {
  FIRE: 'fire',
  WATER: 'water',
  EARTH: 'earth',
  AIR: 'air',
  LIGHTNING: 'lightning',
  SHADOW: 'shadow',
  LIGHT: 'light',
  NEUTRAL: 'neutral'
} as const;

export const CardRarity = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
} as const;

export const ActionType = {
  ATTACK: 'attack',
  DEFEND: 'defend',
  MOVE: 'move',
  CAST_SPELL: 'cast_spell',
  USE_ITEM: 'use_item',
  SPECIAL_ABILITY: 'special_ability'
} as const;

export const GamePhase = {
  SETUP: 'setup',
  CARD_SELECTION: 'card_selection',
  COMBAT: 'combat',
  RESOLUTION: 'resolution',
  VICTORY: 'victory'
} as const;

// Type aliases for the const objects
export type ElementType = typeof ElementType[keyof typeof ElementType];
export type CardRarity = typeof CardRarity[keyof typeof CardRarity];
export type ActionType = typeof ActionType[keyof typeof ActionType];
export type GamePhase = typeof GamePhase[keyof typeof GamePhase];

// Supporting Types
export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'neutral';
  duration: number;
  effect: EffectModifier;
  visualEffect: string;
}

export interface EffectModifier {
  health?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  stamina?: number;
}

export interface LightingConfig {
  ambientColor: string;
  ambientIntensity: number;
  directionalColor: string;
  directionalIntensity: number;
  directionalPosition: Vector3;
  shadows: boolean;
}

export interface TerrainConfig {
  heightmap?: string;
  texture: string;
  normalMap?: string;
  scale: Vector3;
  physics: boolean;
}

export interface WeatherEffect {
  type: 'clear' | 'rain' | 'storm' | 'snow' | 'fog';
  intensity: number;
  particleSystem?: string;
  windDirection: Vector3;
  windStrength: number;
}

export interface ArenaObject {
  id: string;
  name: string;
  modelUrl: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  interactive: boolean;
  physics: boolean;
  health?: number;
}

// Game State
export interface GameState3D {
  gameId: string;
  phase: GamePhase;
  currentTurn: number;
  activePlayer: string;
  
  // Players
  players: GamePlayer[];
  
  // Arena
  arena: CombatArena3D;
  
  // Combat
  combatActions: CombatAction3D[];
  turnTimer: number;
  
  // 3D Scene State
  cameraPosition: Vector3;
  cameraTarget: Vector3;
  selectedCard?: string;
  hoveredFighter?: string;
}

export interface GamePlayer {
  id: string;
  name: string;
  avatar: string;
  fighter: Fighter3D;
  isReady: boolean;
  wins: number;
}

// Tournament System
export interface Tournament {
  id: string;
  name: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'open' | 'in_progress' | 'completed';
  startTime: Date;
  endTime?: Date;
  prizePool: TournamentPrize[];
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  player1: GamePlayer;
  player2: GamePlayer;
  winner?: string;
  gameState?: GameState3D;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TournamentPrize {
  position: number;
  reward: string;
  value: number;
}