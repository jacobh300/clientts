import { useEffect, useRef, useState } from "react";
import {useMessages, useUsers} from "../lib/hooks";
import { Database } from "../lib/database";
import { Message } from "../module_bindings";


export type PrettyMessage = { senderName: string; text: string };





export function Chat() {

  const messages = useMessages(Database.getInstance().getConnection());
  const users = useUsers(Database.getInstance().getConnection());

  const endOfChatRef = useRef<HTMLDivElement>(null);

  const prettyMessages: PrettyMessage[] = [...messages]
    .sort((a, b) => {
    if (a.sent < b.sent) return -1;
    if (a.sent > b.sent) return 1;
    return 0; // stable when equal
    })
    .map(m => ({
      senderName: users.get(m.sender.toHexString())?.name || m.sender.toHexString().substring(0, 8),
      text: m.text,
    }));

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prettyMessages]);


  return (
    <div className="message">
      <h1>Messages</h1>
      {prettyMessages.length < 1 && <p>No messages</p>}
      <div>
        {prettyMessages.map((message, key) => (
          <div key={key}>
            <p><b>{message.senderName}</b></p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div ref={endOfChatRef} />
    </div>
  );
  
}
