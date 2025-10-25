import { DbConnection, type ErrorContext, type EventContext, MessageRow, UserRow } from '../module_bindings';
import { Identity } from "spacetimedb"
export class Database
{
    public static Instance: Database;
    private _initialized: boolean = false;
    private _identity: Identity | null = null;
    private _connection: DbConnection | null = null;
    private _ready?: Promise<Database>;
    private _resolveReady?: (db: Database) => void;
    private _rejectReady?: (err: any) => void;

    private constructor() 
    {
    }

    public Init(auth: string) : Promise<Database>
    {
        if(this._initialized)
        {
            return this._ready!;
        }

        this._initialized = true;
        this._ready = new Promise<Database>((resolve, reject) => {
            this._resolveReady = resolve;
            this._rejectReady = reject;
            setTimeout(() => {
                if (!this._connection) {
                    reject(new Error("Timed out waiting for DB connection"));
                }
            }, 10000);
        });

        DbConnection.builder()
        //.withUri("wss://ttschat.ddns.net") //Swap when deploying
        .withUri("ws://192.168.0.128:3000")
        .withModuleName("sandbox")
        .withToken(auth)
        .onConnect(this.onConnected)
        .onDisconnect(this.onDisconnect)
        .onConnectError(this.onConnectError)
        .build()
        
        
        return this._ready!;   
    }

    public getConnection(): DbConnection | null
    {
        return this._connection;
    }

    public getIdentity(): Identity | null
    {
        return this._identity;
    }

    public static getInstance(): Database
    {
        if (!Database.Instance)
        {
            console.log("Creating new database instance.");
            Database.Instance = new Database();
            return Database.Instance;
        }

        return Database.Instance;
    }
    

    private onConnected = (conn: DbConnection, identity: Identity, token: string) => {
        this._identity = identity;
        this._connection = conn;

        console.log("Connected to SpacetimeDB:" + identity.toHexString());

        conn.subscriptionBuilder()
            .onApplied(this.onSubscriptionApplied)
            .onError(this.onSubscriptionError)
            .subscribe([
                "SELECT * FROM message", 
                "SELECT * FROM user", 
                "SELECT * FROM response", 
                "SELECT * FROM item"
            ]);

        if (this._resolveReady) {
            this._resolveReady(Database.Instance);
            this._resolveReady = undefined;
            this._rejectReady = undefined;
        }
    };

    private onSubscriptionApplied() 
    {
        console.log("SDK client cache initialized.");
    }

    private onSubscriptionError = (ctx: ErrorContext) => 
    {
        console.error("Subscription error: ", ctx.event);
    }

    private onDisconnect = () => {
        console.log("Disconnected from SpacetimeDB");
    };

    private onConnectError = (_ctx: ErrorContext, err: Error) => {
        if (this._rejectReady) {
            this._rejectReady(err);
            this._initialized = false;
            this._rejectReady = undefined;
            this._resolveReady = undefined;
        }

    };
}