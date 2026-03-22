import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import './CSS/chat.css';
function ChatWindow({ selectedRoom, messages, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="chat-window">
      <header className="chat-window-header">
        <h2>#{selectedRoom}</h2>
      </header>

      <div className="chat-message-list">
        {messages.map((message) => (
          <MessageBubble key={message.id} {...message} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSend} />
    </section>
  );
}

export default ChatWindow;
