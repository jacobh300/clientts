import { useEffect, useState } from "react";
import "./styles/App.css";
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
import { Pages } from "./components/Pages";
import { useDb } from "./providers/DatabaseProvider"; 
export type PrettyMessage = { senderName: string; text: string };
export type UserInfo = {user : UserRow | null};

function App() {
  const {conn, identity, connected} = useDb();
  const [systemMessage, setSystemMessage] = useState("");

  const users = useUsers(conn);
  const eventMessage = useEvents(conn);
  const db = Database.getInstance();

  const userList: UserInfo[] = [...users.values()]
  .filter(u => u.online == true)
  .map(user => ({
    user: user,
  }));

  if (!conn || !connected || !identity) {
    return <div className="App"><h1>Connecting...</h1></div>;
  }
  else
  {
    const name = users.get(identity.toHexString())?.name || identity.toHexString().substring(0, 8);

    return (
      <div className="App">
        <Profile conn={conn} name={name} identityHex={identity.toHexString()} />
        <Pages />
        <Chat />
        <UserList users = {userList} />
        <NewMessageForm conn={conn} />
        <AuthButtons />
      </div>
    );
  }
}

export default App;
