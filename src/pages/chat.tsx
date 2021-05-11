// ACTIVATE ON PROD
// uncomment the first use effect and the second use effect's return
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
// import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  Heading,
  Input,
  Button,
  UnorderedList,
  ListItem,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useSocket, useUser, useMain } from "@/context/contexts";
import { RoomMessage, User } from "types";
import ChatMessageRef from "@/components/chatMessage";

export default function Chat(): JSX.Element {
  const socket = useSocket();
  const [users, setUsers] = useUser();
  const [_name, room, _setName, _setRoom] = useMain();
  // const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  // useEffect((): void => {
  //   if (!name || !room) {
  //     router.push("/");
  //   }
  // }, [name, room]);

  useEffect((): void => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView();
    }
  }, [messages]);

  useEffect(() => {
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
      socket.on("roomMessage", (msg: RoomMessage): void => {
        console.log(`${msg.from} -> ${msg.message}`);
        setMessages((msgs) => [...msgs, msg]);
      });
      /* 
        return (): void => {
          socket.emit("logout", (): void => {
            setName("");
            setRoom("");
            router.push("/");
          });
        };
      */
    }
  }, [socket]);

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    socket.emit("roomMessage", message);
    setMessage("");
  };

  return (
    <Box
      as="main"
      style={{ height: "100vh", maxHeight: "100vh", minHeight: "100vh" }}
    >
      <Head>
        <title>Chat</title>
        <meta name="chat" content="Chat section from Next-chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex w="full" h="full">
        <Box w="xs" borderRightWidth="1px" px={2}>
          <Heading as="h1" size="lg">
            Users@{room}
          </Heading>
          <UnorderedList>
            {users.map(
              (user: User): JSX.Element => {
                return (
                  <ListItem key={`roomUsers-${user.id}`}>{user.name}</ListItem>
                );
              }
            )}
          </UnorderedList>

          <Link href="/">
            <a>home</a>
          </Link>
        </Box>

        <Flex
          w="full"
          px={2}
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex direction="column" overflowY="scroll" grow={2}>
            {messages.map(
              (msg: RoomMessage): JSX.Element => (
                <ChatMessageRef
                  ref={chatRef}
                  key={`chatMessage-${uuidv4()}`}
                  msg={msg}
                />
              )
            )}
          </Flex>
          <Flex as="form" onSubmit={handleLogin} my={4}>
            <Input
              placeholder="message"
              value={message}
              onChange={(e): void => setMessage(`${e.target.value}`)}
            />
            <Button type="submit" colorScheme="teal" h="full" ml={1}>
              -&gt;
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
