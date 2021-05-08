import { createContext, useContext, useState } from "react";

const UserContext = createContext([]);

function UserProvider({ children }): JSX.Element {
  const [user, setUser] = useState<any[]>([]);
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
