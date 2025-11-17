# Fighter Game Backend

WebSocket server for multiplayer functionality using Socket.io.

## Setup

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:3001`

## Socket Events

### Client -> Server

- `createRoom` - Create a new game room
- `joinRoom` - Join an existing room
- `playerReady` - Toggle player ready status
- `selectFighter` - Select a fighter character
- `playCard` - Play a card during combat
- `endTurn` - End current player's turn
- `syncGameState` - Sync game state to other players
- `chatMessage` - Send chat message to room

### Server -> Client

- `playerJoined` - Another player joined the room
- `roomUpdate` - Room data updated (ready status, fighter selection)
- `gameStart` - Game is starting (both players ready)
- `cardPlayed` - A card was played by opponent
- `turnEnded` - Turn ended by opponent
- `gameStateUpdate` - Game state synced from opponent
- `playerDisconnected` - A player disconnected
- `chatMessage` - Chat message received

## Room Management

- Each room supports exactly 2 players
- Room codes are 6 characters (uppercase alphanumeric)
- Rooms are automatically deleted when empty
- Players are assigned IDs: `player1` (host) and `player2` (guest)

## Technology

- **Express** - HTTP server
- **Socket.io** - WebSocket communication
- **CORS** - Cross-origin support for Vite frontend
- **UUID** - Unique ID generation
