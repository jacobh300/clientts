import { useEffect, useState } from "react";
import "./App.css";
import { DbConnection, type ErrorContext, type EventContext, Message, User } from './module_bindings';
import { Identity } from "@clockworklabs/spacetimedb-sdk"
import { useMessages, useUsers } from "./lib/hooks";
import { getCurrentUser } from "./lib/auth";
import { Profile } from "./components/Profile";
import { MessageList } from "./components/MessageList";
import { NewMessageForm } from "./components/NewMessageForm";
import { AuthButtons } from "./components/AuthButtons";
import { Database } from "./lib/database";
import { AuthUser } from "./lib/auth";
import { UserList } from "./components/UserList";

export type PrettyMessage = { senderName: string; text: string };
export type UserInfo = {user : User | null};

function App() {
  const [connected, setConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [conn, setConn] = useState<DbConnection | null>(null);
  const [systemMessage, setSystemMessage] = useState("");
  const messages = useMessages(conn);
  const users = useUsers(conn);
  let token : string | null = null;
  //Test
  useEffect(() => {
    const init = async () =>
    {
      let authUser = new AuthUser(await getCurrentUser());
      token = authUser.getAuthToken();
    
      const db = Database.getInstance();
      try
      {
        await db.Init(token || "");
        setConn(db.getConnection());
        setIdentity(db.getIdentity());
        setConnected(true);
      }
      catch (err)
      {
        console.error("Error initializing database:", err);
        setConnected(false);
      } 
    };
  
    init();
  }, []);

  if (!conn || !connected || !identity) {
    return <div className="App"><h1>Connecting...</h1></div>;
  }

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

  const name = users.get(identity.toHexString())?.name || identity.toHexString().substring(0, 8);

  const userList: UserInfo[] = [...users.values()]
  .filter(u => u.online == true)
  .map(user => ({
    user: user,
  }));


  return (
    <div className="App">
      <Profile conn={conn} name={name} identityHex={identity.toHexString()} />
      <MessageList messages={prettyMessages} />
      <UserList users = {userList} />
      <div className="users">
        <h1>Users</h1>
        <p>{systemMessage}</p>
      </div>
      <NewMessageForm conn={conn} />
      <AuthButtons />
    </div>
  );
}

export default App;
