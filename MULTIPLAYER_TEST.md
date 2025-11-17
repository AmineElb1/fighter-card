# 🐛 Multiplayer Sync Fix - Testing Guide

## ✅ What Was Fixed

### Previous Issue:
- Player 1 plays card → damage happens on P1's screen
- Player 2 sees "waiting for opponent" forever
- No health update or animation on P2's screen
- Both players stuck after first attack

### Root Cause:
- Auto-end turn was running independently on both clients
- Game state sync was not happening correctly
- Phase transitions were not synchronized

### The Fix:
1. **Disabled auto-end turn in multiplayer mode** (only runs in solo)
2. **Single source of truth**: Only the active player sends `endTurn` via socket
3. **Both clients process the endTurn event** to switch turns together
4. **Proper sync timing**:
   - 2.5s: Combat animation completes
   - 2.5s: Game state sync sent (health, phase)
   - 4.5s: End turn signal sent
   - Both clients switch to next player

## 🧪 Test Plan

### Backend Status:
Check backend is running:
```bash
# Should see: 🚀 WebSocket server running on http://localhost:3001
```

### Test Flow:

1. **Open 2 browser windows** at `http://localhost:5174`
2. **Window 1** (Player 1 / Ortiz):
   - Click "Play Online" → "Create Room"
   - Note the room code
   
3. **Window 2** (Player 2 / Steve):
   - Click "Play Online" → "Join Room"
   - Enter room code
   
4. **Both players**: Click "Ready"

5. **Game starts - Player 1's turn (Ortiz)**

6. **Window 1 Actions**:
   - Select an attack card
   - Click "Play Move"
   - **Watch console for**:
     - `🎴 Card played`
     - `🔄 Syncing game state after my action`
     - `⏭️ Sending end turn to server`

7. **Window 2 Observations**:
   - Should see "⏳ Waiting for opponent's move..."
   - After ~2.5s: Steve should take damage (health bar updates)
   - After ~4.5s: UI should switch to "STEVE'S TURN (YOU)"
   - **Watch console for**:
     - `🎴 Opponent played card`
     - `🔄 Game state update received`
     - `💊 Updating fighter health`
     - `⏭️ Turn ended by: player1`

8. **Window 2 Actions** (Now Player 2's turn):
   - Select an attack card
   - Click "Play Move"
   - Same process repeats in reverse

## 🔍 Console Logs to Watch

### Active Player (playing card):
```
🌐 Sending card play to server: {cardId: "...", targetId: "..."}
🎴 Card played
🎮 Processing combat action
⚔️ Ortiz attacks Steve for 20 damage!
💊 Health update: 100 → 80
🔄 Syncing game state after my action
⏭️ Sending end turn to server
```

### Opponent Player (receiving):
```
🎴 Opponent played card: {playerId: "player1", cardId: "...", targetId: "..."}
🎴 Processing opponent card play locally
🎮 Processing combat action
⚔️ Ortiz attacks Steve for 20 damage!
💊 Health update: 100 → 80
🔄 Game state update received
💊 Syncing fighter health: [{id: "fighter2", health: 80}, ...]
💊 Updating fighter fighter2 health to 80
⏭️ Turn ended by: player1
🔄 Turn 1 complete. Switching to Player 2
```

## ✅ Success Criteria

- [ ] Both players see damage happen at roughly the same time (~2.5s after card play)
- [ ] Health bars update on both screens
- [ ] Combat animations play on both screens
- [ ] After ~4.5s, turn switches to Player 2
- [ ] Player 2 can now select and play cards
- [ ] Player 1 sees "⏳ Waiting for opponent's move..."
- [ ] Process repeats smoothly for multiple turns

## ❌ If Something Goes Wrong

### Both stuck on "waiting for opponent":
- **Check**: Is backend running on port 3001?
- **Check**: Console errors in either window?
- **Fix**: Refresh both windows and rejoin

### Health not updating on opponent:
- **Check**: Console shows "💊 Updating fighter health"?
- **Check**: Are both clients connected to same room?
- **Debug**: Check room code matches

### Animations not playing:
- **Check**: processCombatActions being called?
- **Check**: Fighter IDs match (fighter1, fighter2)?

### Turn not switching:
- **Check**: `⏭️ Turn ended` appears in console?
- **Check**: Backend received endTurn event?
- **Check**: Both clients process turnEnded?

## 🎮 Expected Behavior

### Player 1's Turn:
- Player 1: Can select and play cards
- Player 2: Sees "waiting for opponent"
- After P1 plays: Both see combat animation
- After ~4.5s: Turn switches to Player 2

### Player 2's Turn:
- Player 2: Can select and play cards  
- Player 1: Sees "waiting for opponent"
- After P2 plays: Both see combat animation
- After ~4.5s: Turn switches back to Player 1

### Victory:
- When health reaches 0: Both see victory screen
- Winner announced on both screens
- Both can click "Rematch" or "Menu"

## 🔧 Key Changes in Code

1. **`gameStore.ts`**: Disabled auto-endTurn in multiplayer
2. **`useMultiplayerSync.ts`**: Single source endTurn from active player
3. **`useMultiplayerSync.ts`**: Proper timing for sync + endTurn
4. **`useMultiplayerSync.ts`**: Both clients process turnEnded event

## 📝 Notes

- The 4.5s delay is intentional (combat + resolution animations)
- Solo mode still works with auto-endTurn
- Health sync happens before turn switch
- Phase sync happens automatically with game state
