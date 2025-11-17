import { io, Socket } from 'socket.io-client';
import type {
  CreateRoomResponse,
  JoinRoomResponse,
  SocketResponse,
  PlayerJoinedEvent,
  RoomUpdateEvent,
  GameStartEvent,
  CardPlayedEvent,
  TurnEndedEvent,
  GameStateUpdateEvent,
  PlayerDisconnectedEvent,
  ChatMessageEvent,
} from '../types/socket';

const SOCKET_URL = 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to server:', this.socket?.id);
        this.isConnected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected:', reason);
        this.isConnected = false;
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Room management
  createRoom(playerName: string): Promise<CreateRoomResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('createRoom', { playerName }, (response: CreateRoomResponse) => {
        if (response.success) {
          console.log('🎮 Room created:', response.roomId);
          resolve(response);
        } else {
          console.error('❌ Failed to create room:', response.error);
          reject(new Error(response.error));
        }
      });
    });
  }

  joinRoom(roomId: string, playerName: string): Promise<JoinRoomResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('joinRoom', { roomId, playerName }, (response: JoinRoomResponse) => {
        if (response.success) {
          console.log('👥 Joined room:', response.roomId);
          resolve(response);
        } else {
          console.error('❌ Failed to join room:', response.error);
          reject(new Error(response.error));
        }
      });
    });
  }

  setPlayerReady(isReady: boolean): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('playerReady', { isReady }, (response: SocketResponse) => {
        if (response?.success) {
          console.log(`${isReady ? '✅' : '❌'} Player ready status:`, isReady);
          resolve(response);
        } else {
          reject(new Error('Failed to set ready status'));
        }
      });
    });
  }

  selectFighter(fighterId: string): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('selectFighter', { fighterId }, (response: SocketResponse) => {
        if (response?.success) {
          console.log('🥊 Fighter selected:', fighterId);
          resolve(response);
        } else {
          reject(new Error('Failed to select fighter'));
        }
      });
    });
  }

  // Game actions
  playCard(cardId: string, targetId: string): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('playCard', { cardId, targetId }, (response: SocketResponse) => {
        if (response?.success) {
          console.log('🎴 Card played:', cardId);
          resolve(response);
        } else {
          reject(new Error('Failed to play card'));
        }
      });
    });
  }

  endTurn(): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('endTurn');
    console.log('⏭️  Turn ended');
  }

  syncGameState(gameState: unknown): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('syncGameState', { gameState });
  }

  sendChatMessage(message: string): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('chatMessage', { message });
  }

  // Event listeners
  onPlayerJoined(callback: (data: PlayerJoinedEvent) => void): void {
    this.socket?.on('playerJoined', callback);
  }

  onRoomUpdate(callback: (data: RoomUpdateEvent) => void): void {
    this.socket?.on('roomUpdate', callback);
  }

  onGameStart(callback: (data: GameStartEvent) => void): void {
    this.socket?.on('gameStart', callback);
  }

  onCardPlayed(callback: (data: CardPlayedEvent) => void): void {
    this.socket?.on('cardPlayed', callback);
  }

  onTurnEnded(callback: (data: TurnEndedEvent) => void): void {
    this.socket?.on('turnEnded', callback);
  }

  onGameStateUpdate(callback: (data: GameStateUpdateEvent) => void): void {
    this.socket?.on('gameStateUpdate', callback);
  }

  onPlayerDisconnected(callback: (data: PlayerDisconnectedEvent) => void): void {
    this.socket?.on('playerDisconnected', callback);
  }

  onChatMessage(callback: (data: ChatMessageEvent) => void): void {
    this.socket?.on('chatMessage', callback);
  }

  // Remove event listeners
  off(eventName: string, callback?: (...args: unknown[]) => void): void {
    if (callback) {
      this.socket?.off(eventName, callback);
    } else {
      this.socket?.off(eventName);
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
