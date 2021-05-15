// ACTIVATE ON PROD
// uncomment the first use effect and the second use effect's return
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { useSocket, useUsers, useMain } from "@/context/contexts";
import { RoomMessage, User } from "types";
import ChatMessageRef from "@/components/chatMessage";
import { AES, enc as CryptoEnc } from "crypto-js";
import noLeadOrTrailWhites from "utils/sanitizer";

export default function Chat(): JSX.Element {
  const HARCODEDPASSWORD = "password";
  const socket = useSocket();
  const [users, setUsers] = useUsers();
  const [name, room, setName, setRoom] = useMain();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect((): void => {
    if (!name || !room) {
      setUsers([]);
      router.push("/");
    }
  }, [name, room]);

  useEffect((): void => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView();
    }
  }, [messages]);

  useEffect((): (() => void) => {
    if (socket) {
      const start = Date.now();
      socket.emit("ping", (id: string): void => {
        console.log(`pong (${Date.now() - start}ms) - ${id}`);
      });
      socket.on("users", (roomUsers): void => {
        setUsers(roomUsers);
      });
      socket.on("notification", (noti): void => {
        console.log(noti.title, noti.description);
      });
      socket.on("roomMessage", ({ from, message }: RoomMessage): void => {
        const bytes = AES.decrypt(message, HARCODEDPASSWORD);
        const decMessage = bytes.toString(CryptoEnc.Utf8);
        setMessages((msgs): RoomMessage[] => [
          ...msgs,
          { from: from, message: decMessage },
        ]);
      });
      return (): void => {
        socket.emit("logout", (): void => {
          socket.off("users");
          socket.off("notification");
          socket.off("roomMessage");
          setName("");
          setRoom("");
          router.push("/");
        });
      };
    }
  }, [socket]);

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    const sanitizedMsg = noLeadOrTrailWhites(message);
    if (sanitizedMsg) {
      const cyphertext = AES.encrypt(sanitizedMsg, HARCODEDPASSWORD).toString();
      socket.emit("roomMessage", cyphertext);
      setMessage("");
    }
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
                  from={msg.from}
                  message={msg.message}
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
