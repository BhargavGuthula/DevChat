import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({
  rooms,
  selectedRoomId,
  onRoomSelect,
  onCreateRoom,
  creatingRoom,
  loadingRooms,
  user,
  isSidebarOpen,
  onCloseSidebar,
}) {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');

  const handleCreateRoom = async (event) => {
    event.preventDefault();

    const created = await onCreateRoom({
      name: roomName,
      description: roomDescription,
    });

    if (created) {
      setRoomName('');
      setRoomDescription('');
    }
  };

  return (
    <aside className={`chat-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
      <div>
        <div className="chat-sidebar-top">
          <p className="chat-sidebar-label">Rooms</p>
          <button
            type="button"
            className="sidebar-close"
            aria-label="Close menu"
            onClick={onCloseSidebar}
          >
            x
          </button>
        </div>
        <h1>DevChat</h1>
        <p className="chat-sidebar-subtitle">
          {user?.username ? `Signed in as ${user.username}` : 'Workspace'}
        </p>
      </div>

      <div className="room-section">
        <form className="room-create-form" onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="New room name"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            disabled={creatingRoom}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={roomDescription}
            onChange={(event) => setRoomDescription(event.target.value)}
            disabled={creatingRoom}
          />
          <button type="submit" disabled={creatingRoom}>
            {creatingRoom ? 'Creating...' : 'Create Room'}
          </button>
        </form>

        <nav className="room-list" aria-label="Rooms">
          {loadingRooms ? (
            <p className="room-list-state">Loading rooms...</p>
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <button
                key={room._id}
                type="button"
                className={`room-button ${selectedRoomId === room._id ? 'active' : ''}`}
                onClick={() => onRoomSelect(room._id)}
              >
                #{room.name}
              </button>
            ))
          ) : (
            <p className="room-list-state">No rooms yet. Create one to begin.</p>
          )}
        </nav>
      </div>

      <div className="sidebar-actions">
        <button
          type="button"
          className="sidebar-settings"
          onClick={() => navigate('/settings')}
        >
          Settings
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
