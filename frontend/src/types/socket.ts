// Socket event types
export interface RoomPlayer {
  id: string;
  name: string;
  isReady: boolean;
  fighter: string | null;
}

export interface RoomInfo {
  roomId: string;
  players: RoomPlayer[];
  isGameStarted: boolean;
  isFull: boolean;
  isReady: boolean;
}

export interface CreateRoomResponse {
  success: boolean;
  roomId: string;
  playerId: string;
  room: RoomInfo;
  error?: string;
}

export interface JoinRoomResponse {
  success: boolean;
  roomId: string;
  playerId: string;
  room: RoomInfo;
  error?: string;
}

export interface PlayerJoinedEvent {
  room: RoomInfo;
}

export interface RoomUpdateEvent {
  room: RoomInfo;
}

export interface GameStartEvent {
  message: string;
}

export interface CardPlayedEvent {
  playerId: string;
  cardId: string;
  targetId: string;
}

export interface TurnEndedEvent {
  playerId: string;
}

export interface GameStateUpdateEvent {
  gameState: unknown;
}

export interface PlayerDisconnectedEvent {
  message: string;
  room: RoomInfo;
}

export interface ChatMessageEvent {
  playerName: string;
  message: string;
  timestamp: number;
}

export interface SocketResponse {
  success: boolean;
  error?: string;
}
