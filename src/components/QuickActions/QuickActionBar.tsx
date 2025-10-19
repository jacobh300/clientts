import { useNavigate } from "react-router-dom";
import { DbConnection } from "../../module_bindings";


export function QuickActionBar({ conn }: { conn: DbConnection })
{

    const navigate = useNavigate();

    const onClickChat = () =>
    {
        navigate('/chat', { replace: true });
    }

    const onClickGetCoin = () =>
    {
        conn.reducers.reducerGetCoinCommand();
    }

    return (
    
        <div className="QuickActionBar">
            <button className="quickAction_button" onClick={onClickGetCoin}>Get Coin</button> 
        </div>
    );

}