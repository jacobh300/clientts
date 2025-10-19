import { useEffect, useState } from "react";
import { DbConnection, type EventContext, MessageRow, UserRow, ResponseRow, ItemRow } from "../module_bindings";

export function useMessages(conn: DbConnection | null): MessageRow[] {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  useEffect(() => {
    if (!conn) return;

    if(conn.db.message != null)
    {
      setMessages(Array.from(conn.db.message.iter()));
    }

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

    if(conn.db.user != null)
    {
      const initialUsers = Array.from(conn.db.user.iter());
      const userMap = new Map<string, UserRow>();
      initialUsers.forEach(user => {
        userMap.set(user.identity.toHexString(), user);
      });
      setUsers(userMap);
    }
    //Insert
    const onInsert = (_ctx: EventContext, user: UserRow) => {
      setUsers(prev => new Map(prev.set(user.identity.toHexString(), user)));
    };
    conn.db.user.onInsert(onInsert);
    //Update
    const onUpdate = (_ctx: EventContext, oldUser: UserRow, newUser: UserRow) => {
      setUsers(prev => {
        prev.delete(oldUser.identity.toHexString());
        return new Map(prev.set(newUser.identity.toHexString(), newUser));
      });
    };
    conn.db.user.onUpdate(onUpdate);
    //Delete
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

export function useItems(conn: DbConnection | null): Map<string, ItemRow> 
{
  const [items, setItems] = useState<Map<string, ItemRow>>(new Map());

  useEffect(() => {
    if (!conn) { setItems(new Map()); return; }
    const table = conn.db.item;
    if (!table) { setItems(new Map()); return; }

    // snapshot
    if (table.iter) {
      const snap = new Map<string, ItemRow>();
      for (const row of table.iter() as Iterable<ItemRow>) {
        snap.set(row.owner.toHexString(), row);
      }
      setItems(snap);
    }

    const onInsert = (_: EventContext, row: ItemRow) => {
      const key = row.owner.toHexString();
      setItems(prev => {
        const next = new Map(prev);
        next.set(key, row);
        return next;
      });

    };

    const onUpdate = (_: EventContext, oldRow: ItemRow, newRow: ItemRow) => {
      const oldKey = oldRow.owner.toHexString();
      const newKey = newRow.owner.toHexString();
      setItems(prev => {
        const next = new Map(prev);
        if (oldKey !== newKey) next.delete(oldKey);
        next.set(newKey, newRow); // amount changes will just replace
        return next;
      });
    };

    const onDelete = (_: EventContext, row: ItemRow) => {
      const key = row.owner.toHexString();
      setItems(prev => {
        const next = new Map(prev);
        next.delete(key);
        return next;
      });
    };

    table.onInsert(onInsert);
    table.onUpdate?.(onUpdate);
    table.onDelete?.(onDelete);
    return () => {
      table.removeOnInsert(onInsert);
      table.removeOnUpdate?.(onUpdate);
      table.removeOnDelete?.(onDelete);
    };
  }, [conn]);



  return items;
}


export function useResponse(conn: DbConnection | null): string {
  const[event, setEvent] = useState<string>("");  
  
  useEffect(() => {
    if(!conn) return;
    console.log("Setting up event listener");
    const onInsert = (_ctx: EventContext, event: ResponseRow) => {
      setEvent(event.data);
      console.log("New message inserted:", event.data);
    }
    conn.db.response.onInsert(onInsert);

    const onDelete = (_ctx: EventContext, event: ResponseRow) => {
      console.log("Message deleted:", event.data);
    }
    conn.db.response.onDelete(onDelete);

    return () =>
    {
      conn.db.response.removeOnInsert(onInsert);
      conn.db.response.removeOnDelete(onDelete);
    }

  }, [conn]);

  return event;
}