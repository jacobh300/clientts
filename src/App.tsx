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

export type PrettyMessage = { senderName: string; text: string };

function App() {
  const [connected, setConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [conn, setConn] = useState<DbConnection | null>(null);
  const [systemMessage, setSystemMessage] = useState("");
  const messages = useMessages(conn);
  const users = useUsers(conn);
  //Testing
  useEffect(() => {
    const init = async () =>
    {
      try
      {
        let token = localStorage.getItem("stdb_access_token");
        console.log("Stored auth token:", token);
        const user = await getCurrentUser().then(user => {
          if (user && user.id_token) {
            token = user.id_token;
            console.log("Got current user with token:", user);
            // Otherwise, pick an OIDC token the server can validate
            if (token && user) {
              // If your provider gives a JWT access_token, prefer it; otherwise use id_token
              const candidate = user.access_token && user.access_token.split(".").length === 3
                ? user.access_token
                : user.id_token; // Google: use id_token
              token = candidate || "";
            }
          } else {
            console.log("No current user");
            token = null;
          }
        }).catch(err => {
          console.error("Error getting current user:", err);
          token = null;
        });


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

      }
      catch (err)
      {
        console.error("Error during initialization:", err);
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
