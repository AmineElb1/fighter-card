import React, { useState, useEffect } from 'react';
import { socketService } from '../../services/socketService';
import type { RoomInfo } from '../../types/socket';
import './MultiplayerLobby.css';

interface MultiplayerLobbyProps {
  onBackToMenu: () => void;
  onStartGame: (roomId: string, playerId: string) => void;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onBackToMenu, onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState<RoomInfo | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Connect to socket server
    const connectSocket = async () => {
      try {
        if (!socketService.isSocketConnected()) {
          await socketService.connect();
        }
      } catch (err) {
        setError('Failed to connect to server. Please try again.');
        console.error('Socket connection error:', err);
      }
    };

    connectSocket();

    // Set up event listeners
    socketService.onPlayerJoined((data) => {
      console.log('Player joined:', data);
      setCurrentRoom(data.room);
    });

    socketService.onRoomUpdate((data) => {
      console.log('Room updated:', data);
      setCurrentRoom(data.room);
    });

    socketService.onGameStart((data) => {
      console.log('Game starting:', data.message);
      if (currentRoom && myPlayerId) {
        onStartGame(currentRoom.roomId, myPlayerId);
      }
    });

    socketService.onPlayerDisconnected((data) => {
      console.log('Player disconnected:', data.message);
      setCurrentRoom(data.room);
      setError(data.message);
    });

    // Cleanup on unmount
    return () => {
      socketService.off('playerJoined');
      socketService.off('roomUpdate');
      socketService.off('gameStart');
      socketService.off('playerDisconnected');
    };
  }, [currentRoom, myPlayerId, onStartGame]);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const response = await socketService.createRoom(playerName.trim());
      setCurrentRoom(response.room);
      setMyPlayerId(response.playerId);
      console.log('Room created successfully:', response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
      console.error('Create room error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomCode.trim()) {
      setError('Please enter room code');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const response = await socketService.joinRoom(roomCode.toUpperCase().trim(), playerName.trim());
      setCurrentRoom(response.room);
      setMyPlayerId(response.playerId);
      console.log('Joined room successfully:', response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
      console.error('Join room error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleToggleReady = async () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);

    try {
      await socketService.setPlayerReady(newReadyState);
    } catch (err) {
      console.error('Failed to set ready status:', err);
      setIsReady(!newReadyState); // Revert on error
    }
  };

  const handleLeaveRoom = () => {
    socketService.disconnect();
    setCurrentRoom(null);
    setMyPlayerId(null);
    setIsReady(false);
    setError(null);
  };

  // Not in a room yet - show join/create options
  if (!currentRoom) {
    return (
      <div className="multiplayer-lobby">
        <div className="lobby-container">
          <h1 className="lobby-title">🌐 MULTIPLAYER LOBBY</h1>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="name-input-section">
            <label htmlFor="playerName">Your Name:</label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              disabled={isConnecting}
            />
          </div>

          <div className="lobby-actions">
            <div className="action-section">
              <h3>Create New Room</h3>
              <button
                onClick={handleCreateRoom}
                disabled={isConnecting || !playerName.trim()}
                className="btn btn-create"
              >
                {isConnecting ? 'Creating...' : '🎮 Create Room'}
              </button>
            </div>

            <div className="divider">OR</div>

            <div className="action-section">
              <h3>Join Existing Room</h3>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code..."
                maxLength={6}
                disabled={isConnecting}
                className="room-code-input"
              />
              <button
                onClick={handleJoinRoom}
                disabled={isConnecting || !playerName.trim() || !roomCode.trim()}
                className="btn btn-join"
              >
                {isConnecting ? 'Joining...' : '👥 Join Room'}
              </button>
            </div>
          </div>

          <button onClick={onBackToMenu} className="btn btn-back">
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // In a room - show room details and players
  const me = currentRoom.players.find(p => p.id === myPlayerId);
  const opponent = currentRoom.players.find(p => p.id !== myPlayerId);

  return (
    <div className="multiplayer-lobby">
      <div className="lobby-container room-view">
        <h1 className="lobby-title">🎮 GAME ROOM</h1>

        <div className="room-code-display">
          <span className="room-code-label">Room Code:</span>
          <span className="room-code">{currentRoom.roomId}</span>
          <button
            onClick={() => navigator.clipboard.writeText(currentRoom.roomId)}
            className="btn-copy"
            title="Copy room code"
          >
            📋
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="players-section">
          <h3>Players ({currentRoom.players.length}/2)</h3>

          <div className="players-grid">
            {/* Player 1 */}
            <div className={`player-card ${me?.id === 'player1' ? 'is-me' : ''}`}>
              <div className="player-header">
                <span className="player-number">Player 1</span>
                {me?.id === 'player1' && <span className="badge-me">YOU</span>}
              </div>
              {currentRoom.players[0] ? (
                <>
                  <div className="player-name">{currentRoom.players[0].name}</div>
                  <div className="player-status">
                    {currentRoom.players[0].isReady ? (
                      <span className="status-ready">✅ Ready</span>
                    ) : (
                      <span className="status-waiting">⏳ Not Ready</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="player-empty">Waiting for player...</div>
              )}
            </div>

            {/* Player 2 */}
            <div className={`player-card ${me?.id === 'player2' ? 'is-me' : ''}`}>
              <div className="player-header">
                <span className="player-number">Player 2</span>
                {me?.id === 'player2' && <span className="badge-me">YOU</span>}
              </div>
              {currentRoom.players[1] ? (
                <>
                  <div className="player-name">{currentRoom.players[1].name}</div>
                  <div className="player-status">
                    {currentRoom.players[1].isReady ? (
                      <span className="status-ready">✅ Ready</span>
                    ) : (
                      <span className="status-waiting">⏳ Not Ready</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="player-empty">Waiting for player...</div>
              )}
            </div>
          </div>
        </div>

        {!opponent && (
          <div className="waiting-message">
            Waiting for another player to join...
          </div>
        )}

        {opponent && (
          <div className="ready-section">
            <button
              onClick={handleToggleReady}
              className={`btn btn-ready ${isReady ? 'is-ready' : ''}`}
            >
              {isReady ? '✅ Ready!' : '⏳ Click when Ready'}
            </button>

            {currentRoom.isReady && (
              <div className="starting-message">
                🎮 Starting game...
              </div>
            )}
          </div>
        )}

        <button onClick={handleLeaveRoom} className="btn btn-leave">
          ← Leave Room
        </button>
      </div>
    </div>
  );
};

export default MultiplayerLobby;
