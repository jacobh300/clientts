import { useState } from "react";
import { DbConnection } from "../../module_bindings";

export function NewMessageForm({ conn }: { conn: DbConnection }) {
  const [newMessage, setNewMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const onMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(newMessage.startsWith("/")) {
      // Handle commands here in the future
      let params = newMessage.toLowerCase().split(" ");
      let command = params[0].slice(1);
      if(command == "help")
      {
        conn.reducers.reducerHelpCommand();
      }
      else if(command == "getuser")
      {
        let username = params[1];
        conn.reducers.reducerGetUserCommand(username);
      }
      else
      {
        console.warn("Unknown command:", command);
      }
    }
    else
    {
      conn.reducers.sendMessage(newMessage);
    }

    setNewMessage("");
  };

  function onTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewMessage(e.target.value);
  }


  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onMessageSubmit(e);
    }
  }

  return (
    <div className="new-message">
      <form
        onSubmit={onMessageSubmit}
        style={{ display: "flex", flexDirection: "column", width: "50%", margin: "0 auto" }}
      >
        <textarea
          value={newMessage}
          placeholder="Type your message here..."
          onChange={onTextChange}
          onKeyDown={onKeyDown}
        ></textarea>
        <button type="submit" hidden >Send</button>
      </form>
    </div>
  );
}
