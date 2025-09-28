import { useState } from "react";
import { DbConnection } from "../module_bindings";

export function NewMessageForm({ conn }: { conn: DbConnection }) {
  const [newMessage, setNewMessage] = useState("");

  const onMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(newMessage.startsWith("/")) {
      // Handle commands here in the future
      let command = newMessage.substring(1).toLowerCase();
      console.log("Command entered: " + command);
      conn.reducers.sendCommand(command, []);
    }
    else
    {
      conn.reducers.sendMessage(newMessage);
    }

    setNewMessage("");
  };

  return (
    <div className="new-message">
      <form
        onSubmit={onMessageSubmit}
        style={{ display: "flex", flexDirection: "column", width: "50%", margin: "0 auto" }}
      >
        <h3>New Message</h3>
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
