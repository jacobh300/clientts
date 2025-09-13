type PrettyMessage = { senderName: string; text: string };

export function MessageList({ messages }: { messages: PrettyMessage[] }) {
  return (
    <div className="message">
      <h1>Messages</h1>
      {messages.length < 1 && <p>No messages</p>}
      <div>
        {messages.map((message, key) => (
          <div key={key}>
            <p><b>{message.senderName}</b></p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
