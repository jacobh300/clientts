// src/pages/Callback.tsx
import { useEffect } from "react";
import {UserManager, WebStorageStateStore} from "oidc-client-ts";

const oidcConfig = 
{
  authority: "https://dev-ttserecwbaauimqy.us.auth0.com",
  client_id: "tJVeFR6i8EIF1mID7tLET7fL61QifGkb",
  redirect_uri: "http://localhost:5173/callback",
  post_logout_redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope:"openid profile email",
  userStore: new WebStorageStateStore({ store: window.localStorage })
}
export const userManager = new UserManager(oidcConfig);

export default function Callback() {
  useEffect(() => {
    userManager.signinRedirectCallback().then(user => {
      console.log("Logged in user:", user);
      window.location.href = "/"; // send them back to home
      
    }).catch(err => {
      console.error("Error during signin redirect callback:", err);
    });
  }, []);

  return <div>Completing login...</div>;
}
