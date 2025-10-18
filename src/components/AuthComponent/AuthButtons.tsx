import { login, logout, getCurrentUserDebugLog } from "../../lib/auth";


export function AuthButtons() {
  return (
    <div className="auth-buttons">

        <style>{`
        .auth-buttons { padding: 1rem; border-top: 1px solid #444; }
        .auth-buttons h1 { margin: 0; font-size: 1.1rem; }
        .auth-buttons button {
          padding: 0.5rem 0.75rem; margin-right: 0.5rem;
          background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;
        }
      `}</style>



      <h1>Auth</h1>
      <button onClick={logout}>Log Out</button>
      <button onClick={login}>Log In</button>
      <button onClick={getCurrentUserDebugLog}>Get Current User</button>
    </div>
  );
}
