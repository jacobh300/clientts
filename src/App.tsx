import { useEffect, useState } from "react";
import "./App.css";
import { DbConnection, type ErrorContext, type EventContext, MessageRow, UserRow } from './module_bindings';
import { Identity } from "spacetimedb"
import { useEvents, useUsers } from "./lib/hooks";
import { getCurrentUser } from "./lib/auth";
import { Profile } from "./components/Profile";
import { Chat } from "./components/Chat";
import { NewMessageForm } from "./components/NewMessageForm";
import { AuthButtons } from "./components/AuthButtons";
import { Database } from "./lib/database";
import { AuthUser } from "./lib/auth";
import { UserList } from "./components/UserList";

export type PrettyMessage = { senderName: string; text: string };
export type UserInfo = {user : UserRow | null};

function App() {
  const [connected, setConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [conn, setConn] = useState<DbConnection | null>(null);
  const [systemMessage, setSystemMessage] = useState("");

  const users = useUsers(conn);
  const eventMessage = useEvents(conn);
  const db = Database.getInstance();

  const userList: UserInfo[] = [...users.values()]
  .filter(u => u.online == true)
  .map(user => ({
    user: user,
  }));

  const init = async () =>
  {
    let authUser = new AuthUser(await getCurrentUser());
    let token = authUser.getAuthToken();

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

  useEffect(() => { init(); }, []);

  if (!conn || !connected || !identity) {
    return <div className="App"><h1>Connecting...</h1></div>;
  }
  else
  {
    const name = users.get(identity.toHexString())?.name || identity.toHexString().substring(0, 8);

    return (
      <div className="App">
        <Profile conn={conn} name={name} identityHex={identity.toHexString()} />
        <Chat />
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
}

export default App;
