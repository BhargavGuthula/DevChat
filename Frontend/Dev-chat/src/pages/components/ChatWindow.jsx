import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import './CSS/chat.css';

function ChatWindow({
  selectedRoom,
  messages,
  loadingMessages,
  error,
  onSend,
  sendingMessage,
  onOpenSidebar,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="chat-window">
      <header className="chat-window-header">
        <button
          type="button"
          className="sidebar-toggle"
          aria-label="Open menu"
          onClick={onOpenSidebar}
        >
          ☰
        </button>
        <h2>{selectedRoom ? `#${selectedRoom.name}` : 'Select a room'}</h2>
      </header>

      <div className="chat-message-list">
        {loadingMessages ? (
          <p className="chat-window-state">Loading messages...</p>
        ) : error ? (
          <p className="chat-window-state">{error}</p>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble key={message.id} {...message} />
          ))
        ) : (
          <p className="chat-window-state">
            {selectedRoom
              ? 'No messages yet. Start the conversation.'
              : 'Choose a room to view messages.'}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        onSend={onSend}
        disabled={!selectedRoom || sendingMessage}
      />
    </section>
  );
}

export default ChatWindow;
