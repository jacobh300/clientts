import { useEffect, useState } from "react";
import { DbConnection, type EventContext, MessageRow, UserRow } from "../module_bindings";

export function useMessages(conn: DbConnection | null): MessageRow[] {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  useEffect(() => {
    if (!conn) return;
    const onInsert = (_ctx: EventContext, message: MessageRow) => {
      setMessages(prev => [...prev, message]);
    };
    conn.db.message.onInsert(onInsert);

    const onDelete = (_ctx: EventContext, message: MessageRow) => {
      setMessages(prev =>
        prev.filter(
          m =>
            m.text !== message.text &&
            m.sent !== message.sent &&
            m.sender !== message.sender
        )
      );
    };
    conn.db.message.onDelete(onDelete);

    return () => {
      conn.db.message.removeOnInsert(onInsert);
      conn.db.message.removeOnDelete(onDelete);
    };
  }, [conn]);

  return messages;
}

export function useUsers(conn: DbConnection | null): Map<string, UserRow> {
  const [users, setUsers] = useState<Map<string, UserRow>>(new Map());

  useEffect(() => {
    if (!conn) return;
    const onInsert = (_ctx: EventContext, user: UserRow) => {
      setUsers(prev => new Map(prev.set(user.identity.toHexString(), user)));
    };
    conn.db.user.onInsert(onInsert);

    const onUpdate = (_ctx: EventContext, oldUser: UserRow, newUser: UserRow) => {
      setUsers(prev => {
        prev.delete(oldUser.identity.toHexString());
        return new Map(prev.set(newUser.identity.toHexString(), newUser));
      });
    };
    conn.db.user.onUpdate(onUpdate);

    const onDelete = (_ctx: EventContext, user: UserRow) => {
      setUsers(prev => {
        prev.delete(user.identity.toHexString());
        return new Map(prev);
      });
    };
    conn.db.user.onDelete(onDelete);

    return () => {
      conn.db.user.removeOnInsert(onInsert);
      conn.db.user.removeOnUpdate(onUpdate);
      conn.db.user.removeOnDelete(onDelete);
    };
  }, [conn]);

  return users;
}


export function useServerMessages(conn: DbConnection | null): String {
  console.log("useServerMessages called");
  
  useEffect(() => {
    if(!conn) return;
  }, [conn]);

  return "";
}