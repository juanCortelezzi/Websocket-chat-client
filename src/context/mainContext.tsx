import { createContext, useContext, useState } from "react";

const MainContext = createContext([]);

function MainProvider({ children }): JSX.Element {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  return (
    <MainContext.Provider value={[name, room, pass, setName, setRoom, setPass]}>
      {children}
    </MainContext.Provider>
  );
}

function useMain(): any[] {
  return useContext(MainContext);
}

export { MainContext, MainProvider, useMain };
