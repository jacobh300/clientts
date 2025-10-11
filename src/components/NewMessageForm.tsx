import { useState } from "react";
import { DbConnection } from "../module_bindings";

export function NewMessageForm({ conn }: { conn: DbConnection }) {
  const [newMessage, setNewMessage] = useState("");

  const onMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(newMessage.startsWith("/")) {
      // Handle commands here in the future
      let params = newMessage.toLowerCase().split(" ");
      let command = params[0].slice(1);
      params = params.slice(1);
      console.log("Command entered: " + command + " with params: " + params);
      conn.reducers.sendCommand(command, params);
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
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
