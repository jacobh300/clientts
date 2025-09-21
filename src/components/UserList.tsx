import { User } from "../module_bindings/user_type";

type UserInfo = { user: User | null; };

export function UserList({ users }: { users: UserInfo[] }) {
  return (
    <div className="users">
      <h1>Users</h1>
      {users.length < 1 && <p>No users</p>}
      <div>
        {users.map((user, key) => {
            let nameVar = "Unknown";
            
            if(user)
            {
                if(user.user)
                {
                    nameVar = user.user.name || user.user.identity.toHexString().substring(0, 8);
                }
            }

            return (
                <div key={key}>
                <p><b>{nameVar}</b></p>
                </div>
            );
        })}
      </div>
    </div>
  );
}
