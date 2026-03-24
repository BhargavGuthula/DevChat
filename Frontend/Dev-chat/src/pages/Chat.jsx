import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const formatMessage = (message, currentUserId) => ({
  id: message._id,
  text: message.text,
  sender: message.sender?.username || 'Unknown',
  timestamp: new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }),
  isOwn: message.sender?._id === currentUserId,
});

function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => localStorage.getItem('devchatTheme') === 'dark',
  );
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState('');
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('devchatUser');

    if (!storedUser) {
      navigate('/');
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser?.token) {
        localStorage.removeItem('devchatUser');
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

  useEffect(() => {
    if (!user?.token) {
      return;
    }

    const loadRooms = async () => {
      setLoadingRooms(true);
      setChatError('');

      try {
        const response = await axios.get(`${API_URL}/api/rooms`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setRooms(response.data);

        if (response.data.length > 0) {
          setSelectedRoomId((current) =>
            current && response.data.some((room) => room._id === current)
              ? current
              : response.data[0]._id,
          );
        } else {
          setSelectedRoomId('');
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('devchatUser');
          navigate('/');
          return;
        }

        setChatError(
          error.response?.data?.message || 'Unable to load rooms right now.',
        );
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, [navigate, user]);

  useEffect(() => {
    if (!user?.token || !selectedRoomId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      setChatError('');

      try {
        const response = await axios.get(
          `${API_URL}/api/rooms/${selectedRoomId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        setMessages(
          response.data.map((message) => formatMessage(message, user._id)),
        );
      } catch (error) {
        setChatError(
          error.response?.data?.message || 'Unable to load room messages.',
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedRoomId, user]);

  const handleCreateRoom = async ({ name, description }) => {
    if (!user?.token) {
      navigate('/');
      return false;
    }

    setCreatingRoom(true);
    setChatError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/rooms`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      setRooms((current) => [...current, response.data]);
      setSelectedRoomId(response.data._id);
      setIsSidebarOpen(false);
      return true;
    } catch (error) {
      setChatError(
        error.response?.data?.message || 'Unable to create the room.',
      );
      return false;
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleSend = async (text) => {
    if (!user?.token || !selectedRoomId) {
      return;
    }

    setSendingMessage(true);
    setChatError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/rooms/${selectedRoomId}/messages`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      setMessages((current) => [
        ...current,
        formatMessage(response.data, user._id),
      ]);
    } catch (error) {
      setChatError(
        error.response?.data?.message || 'Unable to send the message.',
      );
    } finally {
      setSendingMessage(false);
    }
  };

  if (!user) {
    return null;
  }

  const selectedRoom =
    rooms.find((room) => room._id === selectedRoomId) || null;

  return (
    <main
      className={`chat-page ${isDarkTheme ? 'dark-theme' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}
    >
      <button
        type="button"
        className={`chat-overlay ${isSidebarOpen ? 'visible' : ''}`}
        aria-label="Close sidebar"
        onClick={() => setIsSidebarOpen(false)}
      />
      <Sidebar
        rooms={rooms}
        selectedRoomId={selectedRoomId}
        onRoomSelect={(roomId) => {
          setSelectedRoomId(roomId);
          setIsSidebarOpen(false);
        }}
        onCreateRoom={handleCreateRoom}
        creatingRoom={creatingRoom}
        loadingRooms={loadingRooms}
        user={user}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />
      <ChatWindow
        selectedRoom={selectedRoom}
        messages={messages}
        loadingMessages={loadingMessages}
        error={chatError}
        onSend={handleSend}
        sendingMessage={sendingMessage}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
    </main>
  );
}

export default Chat;
