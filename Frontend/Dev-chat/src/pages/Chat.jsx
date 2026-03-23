import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';

function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => localStorage.getItem('devchatTheme') === 'dark',
  );
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('devchatUser');

    if (!storedUser) {
      navigate('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser) {
        navigate('/');
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem('devchatUser');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    setIsDarkTheme(localStorage.getItem('devchatTheme') === 'dark');
  }, []);

  const handleSend = (text) => {
    const storedUser = JSON.parse(localStorage.getItem('devchatUser'));

    if (!storedUser?.username) {
      navigate('/');
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        text,
        sender: storedUser.username,
        timestamp,
        isOwn: true,
      },
    ]);
  };

  if (!user) {
    return null;
  }

  return (
    <main className={`chat-page ${isDarkTheme ? 'dark-theme' : ''}`}>
      <Sidebar
        selectedRoom={selectedRoom}
        onRoomSelect={setSelectedRoom}
        user={user}
      />
      <ChatWindow
        selectedRoom={selectedRoom}
        messages={messages}
        onSend={handleSend}
      />
    </main>
  );
}

export default Chat;
