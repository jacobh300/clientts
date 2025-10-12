import { useState } from "react";
import { DbConnection } from "../module_bindings";

type ProfileProps = {
  conn: DbConnection;
  name: string;
  identityHex: string;
};

export function Profile({ conn, name, identityHex }: ProfileProps) {
  const [newName, setNewName] = useState(name);
  const [editing, setEditing] = useState(false);

  const onSubmitNewName = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    conn.reducers.setName(newName);
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      {!editing ? 
      (
        <>
          <p>{name}</p>
          <button onClick={() => setEditing(true)}>Edit Name</button>
        </>
      ) : 
      (
        <form onSubmit={onSubmitNewName}>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
