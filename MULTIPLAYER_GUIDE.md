# Multiplayer Implementation Guide

## ✅ What's Been Implemented

### Backend (WebSocket Server)
- **Location**: `/fighter-game/backend/`
- **Port**: 3001
- **Technology**: Node.js + Express + Socket.io

#### Features:
- ✅ Room creation with 6-character codes
- ✅ Room joining with validation
- ✅ Player ready/not ready status
- ✅ Real-time game state synchronization
- ✅ Card play events
- ✅ Turn management
- ✅ Player disconnect handling
- ✅ Auto-cleanup of empty rooms

### Frontend
- **Socket Service** (`/src/services/socketService.ts`): Type-safe WebSocket communication
- **Multiplayer Lobby** (`/src/components/screens/MultiplayerLobby.tsx`): Join/create rooms UI
- **Game Store Updates** (`/src/store/gameStore.ts`): Multiplayer state management
- **Multiplayer Sync Hook** (`/src/hooks/useMultiplayerSync.ts`): Real-time game synchronization

## 🎮 How It Works

### Player Assignment:
- **Player 1** (Room Creator): Controls **Ortiz** (Blue UI)
- **Player 2** (Room Joiner): Controls **Steve** (Red UI)

### Game Flow:
1. Player 1 creates a room → Gets 6-character room code
2. Player 2 joins with room code
3. Both players click "Ready"
4. Game automatically starts
5. **Player 1 (Ortiz) goes first**
6. Players take turns playing cards
7. Each player can only play cards on their turn
8. Game state syncs automatically via WebSocket

### Turn-Based Mechanics:
- ✅ Only active player sees card selection UI
- ✅ Opponent sees "⏳ Waiting for opponent's move..."
- ✅ Card plays are sent via socket and applied on both clients
- ✅ Health updates sync in real-time
- ✅ Turn automatically switches after resolution

## 🚀 Running Multiplayer

### 1. Start Backend Server:
\`\`\`bash
cd fighter-game/backend
npm run dev
\`\`\`
Server will run on `http://localhost:3001`

### 2. Start Frontend:
\`\`\`bash
cd fighter-game/frontend
npm run dev
\`\`\`
Frontend will run on `http://localhost:5174`

### 3. Test with Two Players:
1. Open two browser windows/tabs to `http://localhost:5174`
2. **Window 1**: Click "Play Online" → "Create Room"
3. Copy the room code (e.g., "AB12CD")
4. **Window 2**: Click "Play Online" → Paste room code → "Join Room"
5. Both windows: Click "Ready"
6. Game starts! Player 1 (Ortiz) moves first

## 🔧 Key Components

### Socket Events (Backend → Frontend):
- `playerJoined`: Someone joined your room
- `roomUpdate`: Room status changed (ready status, etc.)
- `gameStart`: Both players ready, game starting
- `cardPlayed`: Opponent played a card
- `turnEnded`: Turn switched
- `gameStateUpdate`: Health/phase sync
- `playerDisconnected`: Opponent left

### Socket Events (Frontend → Backend):
- `createRoom`: Create new game room
- `joinRoom`: Join existing room
- `playerReady`: Toggle ready status
- `playCard`: Play a card (synced to opponent)
- `endTurn`: End your turn
- `syncGameState`: Sync health and phase

## 🎯 What Still Works in Solo Mode:
- Everything! Solo mode is completely unchanged
- Bot opponent (Steve) still works
- All animations, cards, and combat mechanics identical

## 🐛 Debugging Tips:

### Check Backend Connection:
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"ok","rooms":0,"players":0}`

### Check Browser Console:
- Look for "🌐 Setting up multiplayer mode"
- Look for "🎴 Card played" messages
- Look for "⏭️ Turn ended" messages

### Common Issues:
1. **"Failed to connect"**: Make sure backend is running on port 3001
2. **"Room not found"**: Room code might be wrong or room was deleted
3. **Cards not syncing**: Check browser console for socket errors
4. **Turn not switching**: Check that both players are connected

## 📝 Code Architecture:

```
Backend:
├── server.js                 # Main WebSocket server
├── Room management           # Room creation, joining, cleanup
└── Event handlers           # Socket event processing

Frontend:
├── GameManager.tsx           # Screen routing (Solo vs Multiplayer)
├── MultiplayerLobby.tsx      # Join/create room UI
├── socketService.ts          # WebSocket communication
├── useMultiplayerSync.ts     # Real-time game sync
├── gameStore.ts             # Multiplayer state (isMultiplayer, myPlayerId)
├── GameScene3D.tsx          # Game rendering (detects multiplayer mode)
├── CardHand.tsx             # Shows only your cards in multiplayer
└── CompactCombatUI.tsx      # Shows turn indicator and waiting message
```

## 🎨 UI Indicators:

### Multiplayer-Specific UI:
- **Turn Display**: "ORTIZ'S TURN (YOU)" or "STEVE'S TURN (OPPONENT)"
- **Waiting Message**: "⏳ Waiting for opponent's move..."
- **Color Coding**: 
  - Player 1 (Ortiz): Blue UI theme
  - Player 2 (Steve): Red UI theme

### Cards:
- In multiplayer: You only see YOUR fighter's cards
- In solo: You see the active player's cards (switches each turn)

## ✨ Future Enhancements:
- [ ] Rematch system (stay in same room)
- [ ] Chat system (already in backend, needs UI)
- [ ] Reconnection handling (auto-rejoin after disconnect)
- [ ] Spectator mode
- [ ] Tournament brackets
- [ ] Player stats and leaderboards

## 🔐 Security Notes:
- Currently no authentication (anyone can create/join rooms)
- Room codes are random 6-character alphanumeric
- Rooms auto-delete when empty
- No persistent storage (rooms exist only in memory)
