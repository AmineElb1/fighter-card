import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Configure CORS - allow both localhost and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://your-frontend-domain.com', // Update this with your actual frontend URL
  /https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview URLs
  /https:\/\/.*\.netlify\.app$/, // Allow all Netlify preview URLs
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      return allowedOrigin.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('⚠️ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Socket.io server with CORS
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin;
        }
        return allowedOrigin.test(origin);
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('⚠️ Blocked Socket.IO origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store active rooms and players
const rooms = new Map();
const players = new Map();

// Room data structure
class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = [];
    this.gameState = null;
    this.isGameStarted = false;
    this.currentTurn = 0;
  }

  addPlayer(playerId, socketId, playerName) {
    if (this.players.length >= 2) {
      return false;
    }
    
    this.players.push({
      id: playerId,
      socketId: socketId,
      name: playerName,
      isReady: false,
      fighter: null
    });
    
    return true;
  }

  removePlayer(socketId) {
    const index = this.players.findIndex(p => p.socketId === socketId);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
    return this.players.length === 0; // Return true if room is now empty
  }

  getPlayer(socketId) {
    return this.players.find(p => p.socketId === socketId);
  }

  isFull() {
    return this.players.length >= 2;
  }

  isReady() {
    return this.players.length === 2 && this.players.every(p => p.isReady);
  }
}

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`✅ Player connected: ${socket.id}`);

  // Create a new room
  socket.on('createRoom', ({ playerName }, callback) => {
    const roomId = generateRoomCode();
    const room = new GameRoom(roomId);
    
    const playerId = `player1`;
    room.addPlayer(playerId, socket.id, playerName);
    
    rooms.set(roomId, room);
    players.set(socket.id, { roomId, playerId });
    
    socket.join(roomId);
    
    console.log(`🎮 Room created: ${roomId} by ${playerName}`);
    
    callback({
      success: true,
      roomId,
      playerId,
      room: getRoomInfo(room)
    });
  });

  // Join an existing room
  socket.on('joinRoom', ({ roomId, playerName }, callback) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    
    if (room.isFull()) {
      callback({ success: false, error: 'Room is full' });
      return;
    }
    
    const playerId = `player2`;
    room.addPlayer(playerId, socket.id, playerName);
    
    players.set(socket.id, { roomId, playerId });
    socket.join(roomId);
    
    console.log(`👥 ${playerName} (${playerId}) joined room: ${roomId}`);
    console.log(`📍 Socket ${socket.id} is now in room ${roomId}`);
    console.log(`👥 Room ${roomId} now has ${room.players.length} players:`, room.players.map(p => `${p.name} (${p.id})`));
    
    // Notify both players
    io.to(roomId).emit('playerJoined', {
      room: getRoomInfo(room)
    });
    
    callback({
      success: true,
      roomId,
      playerId,
      room: getRoomInfo(room)
    });
  });

  // Player ready/not ready
  socket.on('playerReady', ({ isReady }, callback) => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomId);
    if (!room) return;
    
    const player = room.getPlayer(socket.id);
    if (player) {
      player.isReady = isReady;
      
      console.log(`${isReady ? '✅' : '❌'} ${player.name} is ${isReady ? 'ready' : 'not ready'}`);
      
      // Notify all players in room
      io.to(playerInfo.roomId).emit('roomUpdate', {
        room: getRoomInfo(room)
      });
      
      // If both players are ready, start the game
      if (room.isReady()) {
        setTimeout(() => {
          io.to(playerInfo.roomId).emit('gameStart', {
            message: 'Both players ready! Starting game...'
          });
        }, 500);
      }
      
      if (callback) callback({ success: true });
    }
  });

  // Select fighter
  socket.on('selectFighter', ({ fighterId }, callback) => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomId);
    if (!room) return;
    
    const player = room.getPlayer(socket.id);
    if (player) {
      player.fighter = fighterId;
      
      console.log(`🥊 ${player.name} selected fighter: ${fighterId}`);
      
      // Notify all players in room
      io.to(playerInfo.roomId).emit('roomUpdate', {
        room: getRoomInfo(room)
      });
      
      if (callback) callback({ success: true });
    }
  });

  // Play a card
  socket.on('playCard', ({ cardId, targetId }, callback) => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) {
      console.log('❌ playCard: No player info found for socket', socket.id);
      return;
    }
    
    const room = rooms.get(playerInfo.roomId);
    if (!room) {
      console.log('❌ playCard: No room found for roomId', playerInfo.roomId);
      return;
    }
    
    console.log(`🎴 Card played in room ${playerInfo.roomId} by ${playerInfo.playerId}: ${cardId} -> ${targetId}`);
    console.log(`👥 Room has ${room.players.length} players:`, room.players.map(p => p.id));
    console.log(`📡 Broadcasting to room: ${playerInfo.roomId}`);
    
    // Broadcast to all players in room
    io.to(playerInfo.roomId).emit('cardPlayed', {
      playerId: playerInfo.playerId,
      cardId,
      targetId
    });
    
    console.log(`✅ Event emitted to room ${playerInfo.roomId}`);
    
    if (callback) callback({ success: true });
  });

  // End turn
  socket.on('endTurn', () => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomId);
    if (!room) return;
    
    console.log(`⏭️  Turn ended in room ${playerInfo.roomId}`);
    
    // Broadcast to all players in room
    io.to(playerInfo.roomId).emit('turnEnded', {
      playerId: playerInfo.playerId
    });
  });

  // Sync game state
  socket.on('syncGameState', ({ gameState }) => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) {
      console.log('❌ syncGameState: No player info found');
      return;
    }
    
    const room = rooms.get(playerInfo.roomId);
    if (!room) {
      console.log('❌ syncGameState: No room found');
      return;
    }
    
    room.gameState = gameState;
    
    console.log(`🔄 Syncing game state in room ${playerInfo.roomId} from ${playerInfo.playerId}`);
    console.log(`📡 Broadcasting gameStateUpdate to other players in room`);
    
    // Broadcast to other players in room (not sender)
    socket.to(playerInfo.roomId).emit('gameStateUpdate', {
      gameState
    });
    
    console.log(`✅ gameStateUpdate sent to room ${playerInfo.roomId}`);
  });

  // Chat message
  socket.on('chatMessage', ({ message }) => {
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomId);
    if (!room) return;
    
    const player = room.getPlayer(socket.id);
    
    io.to(playerInfo.roomId).emit('chatMessage', {
      playerName: player?.name || 'Unknown',
      message,
      timestamp: Date.now()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Player disconnected: ${socket.id}`);
    
    const playerInfo = players.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomId);
    if (!room) return;
    
    const player = room.getPlayer(socket.id);
    const playerName = player?.name || 'Player';
    
    const isEmpty = room.removePlayer(socket.id);
    
    if (isEmpty) {
      // Room is empty, delete it
      rooms.delete(playerInfo.roomId);
      console.log(`🗑️  Room ${playerInfo.roomId} deleted (empty)`);
    } else {
      // Notify remaining players
      io.to(playerInfo.roomId).emit('playerDisconnected', {
        message: `${playerName} has disconnected`,
        room: getRoomInfo(room)
      });
    }
    
    players.delete(socket.id);
  });
});

// Helper function to generate room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Helper function to get sanitized room info
function getRoomInfo(room) {
  return {
    roomId: room.roomId,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      isReady: p.isReady,
      fighter: p.fighter
    })),
    isGameStarted: room.isGameStarted,
    isFull: room.isFull(),
    isReady: room.isReady()
  };
}

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    players: players.size
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}`);
  console.log(`📡 Frontend should connect to: ws://localhost:${PORT}`);
});
