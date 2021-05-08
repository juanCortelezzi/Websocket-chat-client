import { useSocket } from "@/context/socketContext";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { Heading } from "@chakra-ui/react";
import { MainContext } from "@/context/mainContext";

export default function Chat(): JSX.Element {
  const socket = useSocket();
  const [users, setUsers] = useContext(UserContext);
  const [name, room, _setName, _setRoom] = useContext(MainContext);
  const router = useRouter();

  useEffect((): void => {
    console.log(name, room);
    if (!name || !room) {
      router.push("/");
    }
  }, [name, room]);

  useEffect((): void => {
    if (socket) {
      const start = Date.now();
      socket.emit("ping", (id: string): void => {
        console.log(`pong (${Date.now() - start}ms) - ${id}`);
      });
      socket.on("users", (users): void => {
        setUsers(users);
      });
      socket.on("notification", (noti): void => {
        console.log(noti.title, noti.description);
      });
    }
  }, [socket]);

  return (
    <>
      <Heading as="h1">Chat</Heading>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <Link href="/">
        <a>home</a>
      </Link>
    </>
  );
}
