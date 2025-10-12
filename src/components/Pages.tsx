import { useNavigate } from "react-router-dom";


export function Pages()
{

    const navigate = useNavigate();

    const onClickChat = () =>
    {
        navigate('/chat', { replace: true });
    }

    return (
    
        <div className="Pages">
            
            <button className="page_buttons" onClick={onClickChat}>Chat</button>
            <button className="page_buttons" onClick={onClickChat}>Button</button>
            <button className="page_buttons" onClick={onClickChat}>Button</button>
            <button className="page_buttons" onClick={onClickChat}>Button</button>
            <button className="page_buttons" onClick={onClickChat}>Button</button>
            <button className="page_buttons" onClick={onClickChat}>Button</button>


            
        </div>
    );
}