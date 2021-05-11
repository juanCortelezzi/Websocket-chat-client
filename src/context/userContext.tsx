import { createContext, useContext, useState } from "react";
import { User } from "types";

const UserContext = createContext([]);

function UserProvider({ children }): JSX.Element {
  const [user, setUser] = useState<User[]>([]);
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
}

function useUser(): any[] {
  return useContext(UserContext);
}

export { UserContext, UserProvider, useUser };
