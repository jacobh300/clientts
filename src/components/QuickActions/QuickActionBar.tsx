import { useNavigate } from "react-router-dom";
import { DbConnection } from "../../module_bindings";


export function QuickActionBar({ conn }: { conn: DbConnection })
{

    const navigate = useNavigate();

    const onClickChat = () =>
    {
        navigate('/chat', { replace: true });
    }

    const onClickGetCoin = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        conn.reducers.reducerGetCoinCommand();
    }
   
    const onClickGetCopper = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        conn.reducers.reducerGetCopperCommand();
    }


    return (
    
        <div className="QuickActionBar">
            <button type="button" className="quickAction_button" onClick={(e) => onClickGetCoin(e)}>Get Coin</button> 
            <button type="button" className="quickAction_button" onClick={(e) => onClickGetCopper(e)}>Get Copper</button> 

        </div>
    );

}