import { createContext, useContext, useState } from "react";
import { User } from "types";

const UsersContext = createContext([]);

function UsersProvider({ children }): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  return (
    <UsersContext.Provider value={[users, setUsers]}>
      {children}
    </UsersContext.Provider>
  );
}

function useUsers(): any[] {
  return useContext(UsersContext);
}

export { UsersContext, UsersProvider, useUsers };
