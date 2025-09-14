import { useEffect, useState } from "react";
import "./App.css";
import { DbConnection, type ErrorContext, type EventContext, Message} from './module_bindings';
import { Identity } from "@clockworklabs/spacetimedb-sdk"
import { useMessages, useUsers } from "./lib/hooks";
import { getCurrentUser } from "./lib/auth";
import { Profile } from "./components/Profile";
import { MessageList } from "./components/MessageList";
import { NewMessageForm } from "./components/NewMessageForm";
import { AuthButtons } from "./components/AuthButtons";
import { Database } from "./lib/database";
import { AuthUser } from "./lib/auth";

export type PrettyMessage = { senderName: string; text: string };

function App() {
  const [connected, setConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [conn, setConn] = useState<DbConnection | null>(null);
  const [systemMessage, setSystemMessage] = useState("");
  const messages = useMessages(conn);
  const users = useUsers(conn);
  let token : string | null = null;

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

  const prettyMessages: PrettyMessage[] = messages
    .sort((a, b) => (a.sent > b.sent ? 1 : -1))
    .map(m => ({
      senderName: users.get(m.sender.toHexString())?.name || m.sender.toHexString().substring(0, 8),
      text: m.text,
    }));

  const name = users.get(identity.toHexString())?.name || identity.toHexString().substring(0, 8);

  return (
    <div className="App">
      <Profile conn={conn} name={name} identityHex={identity.toHexString()} />
      <MessageList messages={prettyMessages} />
      <div className="system">
        <h1>System</h1>
        <p>{systemMessage}</p>
      </div>
      <NewMessageForm conn={conn} />
      <AuthButtons />
    </div>
  );
}

export default App;
