import { useState } from 'react';

function MessageInput({ onSend, disabled }) {
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
        placeholder={disabled ? 'Select a room to start chatting' : 'Type a message'}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button type="button" onClick={submitMessage} disabled={disabled}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;
