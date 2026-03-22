import { useState } from 'react';

function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  const submitMessage = () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    onSend(trimmedText);
    setText('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="message-input-bar">
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={submitMessage}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;
