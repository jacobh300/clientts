import { useNavigate } from "react-router-dom";
import { Chat } from "../../components/ChatComponent/Chat";
import { useDb } from "../../providers/DatabaseProvider";
import "./PageChat.css";
import { useEffect } from "react";

export function PageChat()
{
    const {conn, identity, connected} = useDb();
    const navigate = useNavigate();

    const onClickBack = () =>
    {
        navigate('/', { replace: true });
    }

    if (!conn || !connected || !identity) {
        return <div className="page-chat"><h1>Connecting...</h1></div>;
    }

    return (
        <div className="page-chat">
        <button className="back_button" onClick={onClickBack}>Home</button>
        <Chat />
        </div>
    )
}