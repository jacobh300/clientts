import { Chat } from "../components/Chat";
import { useDb } from "../providers/DatabaseProvider";
import "./PageChat.css";


export function PageChat()
{
    const {conn, identity, connected} = useDb();
    return (
        <div className="page-chat">
        <Chat />
        </div>
    )
}