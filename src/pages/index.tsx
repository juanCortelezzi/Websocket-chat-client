import { useSocket } from "@/context/socketContext";
import { Button, Input, VStack, Container, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMain, useUsers } from "@/context/contexts";
import noLeadOrTrailWhites from "utils/sanitizer";
import { User } from "types";

function Home(): JSX.Element {
  const socket = useSocket();
  const [_users, setUsers] = useUsers();
  const [name, room, setName, setRoom] = useMain();
  const router = useRouter();
  const [localName, setLocalName] = useState<string>("");
  const [localRoom, setLocalRoom] = useState<string>("");

  useEffect((): void => {
    const start = Date.now();
    if (socket) {
      socket.emit("ping", (id: string): void => {
        console.log(`pong (${Date.now() - start}ms) - ${id}`);
      });
      socket.on("users", (roomUsers: User[]): void => {
        setUsers(roomUsers);
      });
    }
  }, [socket]);

  function handleLogin(e: React.FormEvent): void {
    e.preventDefault();
    const sanitizedName = noLeadOrTrailWhites(localName);
    const sanitizedRoom = noLeadOrTrailWhites(localRoom);
    if (sanitizedName && sanitizedRoom) {
      socket.emit(
        "login",
        { name: sanitizedName, room: sanitizedRoom },
        ({ error, user }): void => {
          if (error || !user) {
            console.log("something went wrong when signing up:", error);
          } else {
            setName(user.name);
            setRoom(user.room);
            router.push("/chat");
          }
        }
      );
    }
  }

  return (
    <Container>
      <Head>
        <title>Next-Chat</title>
        <meta name="description" content="Chat generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading as="h1">Home</Heading>
      <VStack
        as="form"
        spacing={4}
        align="stretch"
        onSubmit={handleLogin}
        my={4}
      >
        <Input
          placeholder="name"
          value={localName}
          onChange={(e): void => setLocalName(`${e.target.value}`)}
        />
        <Input
          placeholder="room"
          value={localRoom}
          onChange={(e): void => setLocalRoom(`${e.target.value}`)}
        />
        <Button type="submit" colorScheme="teal">
          Join
        </Button>
      </VStack>

      <p>
        {name ? name : "name"}@{room ? room : "room"}
      </p>
      <Link href="/chat">
        <a>chat</a>
      </Link>
    </Container>
  );
}
export default Home;
