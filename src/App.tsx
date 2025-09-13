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
    }
  
    let authToken = localStorage.getItem("auth_token");
    getCurrentUser().then(user => {
      if (user && user.id_token) {
        authToken = user.id_token;  
        console.log("Got current user with token:", user);
      } else {
        console.log("No current user");
      }
    }).catch(err => {
      console.error("Error getting current user:", err);
    });


    const onConnect = (conn: DbConnection, identity: Identity, token: string) => {
      setIdentity(identity);
      setConnected(true);
      localStorage.setItem("auth_token", token);
      console.log("Connected to SpacetimeDB:", identity.toHexString());

      conn.reducers.onSendMessage(() => {
        console.log("Message sent.");
      });

      conn.subscriptionBuilder().onApplied(() => {
        console.log("SDK client cache initialized.");
        
      }).subscribe(["SELECT * FROM message", "SELECT * FROM user"]);
    };

    const onDisconnect = () => {
      console.log("Disconnected from SpacetimeDB");
      setConnected(false);
    };

    const onConnectError = (_ctx: ErrorContext, err: Error) => {
      console.log("Error connecting:", err);
    };

    setConn(
      DbConnection.builder()
        .withUri("ws://192.168.1.143:3000")
        .withModuleName("sandbox")
        .withToken(authToken || "")
        .onConnect(onConnect)
        .onDisconnect(onDisconnect)
        .onConnectError(onConnectError)
        .build()
    );
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
