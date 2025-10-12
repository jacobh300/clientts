import { createContext, useContext, useEffect, useState } from "react";
import { Database } from "../lib/database";
import { Identity } from "spacetimedb";
import { DbConnection } from "../module_bindings";
import { AuthUser, getCurrentUser } from "../lib/auth";


type DbCtx = {
  conn: DbConnection | null;
  identity: Identity | null;
  connected: boolean;
};


const dbCtx = createContext<DbCtx>({
  conn: null,
  identity: null,
  connected: false,
});

export function DatabaseProvider({children}: {children: React.ReactNode})
{
    const db = Database.getInstance();
    const [conn, setConn] = useState<DbConnection | null>(null);
    const [connected, setConnected] = useState(false);
    const [identity, setIdentity] = useState<Identity | null>(null);

    const init = async () =>
    {
        let authUser = new AuthUser(await getCurrentUser());
        let token = authUser.getAuthToken();

        try
        {
            await db.Init(token || "");
            console.log("Database initialized");  
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

    return (
        <dbCtx.Provider value={{conn, identity, connected}}>
            {children}
        </dbCtx.Provider>
    )
}

export function useDb() {
  return useContext(dbCtx);
}