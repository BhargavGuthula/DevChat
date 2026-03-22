import { useNavigate } from 'react-router-dom';

const ROOMS = ['general', 'random', 'dev', 'design'];

function Sidebar({ selectedRoom, onRoomSelect, user }) {
  const navigate = useNavigate();



  return (
    <aside className="chat-sidebar">
      <div>
        <p className="chat-sidebar-label">Rooms</p>
        <h1>DevChat</h1>
        <p className="chat-sidebar-subtitle">
          {user?.username ? `Signed in as ${user.username}` : 'Workspace'}
        </p>
      </div>

      <nav className="room-list" aria-label="Rooms">
        {ROOMS.map((room) => (
          <button
            key={room}
            type="button"
            className={`room-button ${selectedRoom === room ? 'active' : ''}`}
            onClick={() => onRoomSelect(room)}
          >
            #{room}
          </button>
        ))}
      </nav>

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
