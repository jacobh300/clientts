import { UserManager, WebStorageStateStore } from "oidc-client-ts";
const oidcConfig = {
  authority: "https://dev-ttserecwbaauimqy.us.auth0.com",
  client_id: "tJVeFR6i8EIF1mID7tLET7fL61QifGkb",
  redirect_uri: "http://localhost:5173/callback",
  post_logout_redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);

export function login() {
  return userManager.signinRedirect();
}

export function logout() {
  localStorage.removeItem("stdb_access_token");
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

export async function getCurrentUser() {
  return await userManager.getUser();
}
