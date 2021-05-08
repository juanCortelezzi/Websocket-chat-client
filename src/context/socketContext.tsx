import { createContext, useEffect, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket>(null);

function SocketProvider({ children }): JSX.Element {
  const endpoint = "http://localhost:3001";

  const [socket, setSocket] = useState<Socket>();

  useEffect((): (() => void) => {
    const socketio: Socket = io(endpoint, {
      transports: ["websocket", "polling"],
    });
    setSocket(socketio);
    return (): void => {
      socketio.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

function useSocket(): Socket {
  return useContext(SocketContext);
}

export { SocketContext, SocketProvider, useSocket };
