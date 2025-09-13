import { login, logout, getCurrentUserDebugLog } from "../lib/auth";

export function AuthButtons() {
  return (
    <div>
      <h1>Auth</h1>
      <button onClick={logout}>Log Out</button>
      <button onClick={login}>Log In</button>
      <button onClick={getCurrentUserDebugLog}>Get Current User</button>
    </div>
  );
}
