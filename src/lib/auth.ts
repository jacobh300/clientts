import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";

export const oidcConfig = {
  authority: "https://dev-ttserecwbaauimqy.us.auth0.com",
  client_id: "tJVeFR6i8EIF1mID7tLET7fL61QifGkb",
  //redirect_uri: "https://clientts.vercel.app/callback", //Swap when deploying
  redirect_uri: "http://localhost:5173/callback",
  //post_logout_redirect_uri: "https://clientts.vercel.app/", //Swap when deploying
  post_logout_redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export class AuthUser 
{
  private _user: User | null = null;

  public get user(): User | null
  {
    return this._user;
  }

  public getAuthToken(): string | null
  {
    if(!this._user) return null;

    if(this._user.access_token && this._user.access_token.split(".").length === 3)
    {
      return this._user.access_token;
    }

    if(this._user.id_token && typeof this._user.id_token === "string")
    {
      return this._user.id_token;
    }

    return null;
  }

  public constructor(user: User | null)
  {
    if(!user)
    {
      console.warn("No Auth User provided, creating empty user.");
    }
    else
    {
      this._user = user;
    }
  }
}



export const userManager = new UserManager(oidcConfig);

export function login() {
  return userManager.signinRedirect();
}

export function logout() {
  return userManager.signoutRedirect();
}

export async function getCurrentUserDebugLog()
{
    userManager.getUser().then(user => {
        console.log("Current user:", user);
    }).catch(err => {
        console.error("Error getting current user:", err);
    });
}

export async function getCurrentUser() : Promise<User | null> {
  try { await userManager.clearStaleState(); } catch {}
  const user = await userManager.getUser();
  if (user && !user.expired) {
    return user;
  }
  else
  {
    return null;
  }
}
