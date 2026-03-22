function MessageBubble({ text, sender, timestamp, isOwn }) {
  return (
    <article className={`message-row ${isOwn ? 'own' : ' '}`}>
      <div className={`message-bubble ${isOwn ? 'own' : ''}`}>
        <p>{text}</p>
        <span className="message-meta">
          {sender} - {timestamp}
        </span>
      </div>
    </article>
  );
}

export default MessageBubble;
