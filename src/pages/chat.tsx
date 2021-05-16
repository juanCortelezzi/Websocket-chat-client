import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import NextLink from "next/link";
import Head from "next/head";
import {
  Heading,
  Input,
  Button,
  UnorderedList,
  ListItem,
  Box,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSocket, useUsers, useMain } from "@/context/contexts";
import { RoomMessage, User } from "types";
import ChatMessageRef from "@/components/chatMessage";
import { AES, enc as CryptoEnc } from "crypto-js";
import noLeadOrTrailWhites from "utils/sanitizer";

export default function Chat(): JSX.Element {
  const socket = useSocket();
  const toast = useToast();
  const [users, setUsers] = useUsers();
  const [name, room, pass, setName, setRoom, setPass] = useMain();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect((): void => {
    if (!name || !room || !pass) {
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
        toast({
          title: noti.title,
          description: noti.description,
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      });
      socket.on("roomMessage", ({ from, message }: RoomMessage): void => {
        const bytes = AES.decrypt(message, pass);
        const decMessage = bytes.toString(CryptoEnc.Utf8);
        setMessages((msgs): RoomMessage[] => [
          ...msgs,
          { from: from, message: decMessage },
        ]);
      });
      return (): void => {
        socket.emit("logout", (): void => {
          socket.off("notification");
          socket.off("roomMessage");
          setName("");
          setRoom("");
          setPass("");
          router.push("/");
        });
      };
    }
  }, [socket]);

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    const sanitizedMsg = noLeadOrTrailWhites(message);
    if (sanitizedMsg) {
      const cyphertext = AES.encrypt(sanitizedMsg, pass).toString();
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
      <Flex w="full" h="full" py={4}>
        <Flex
          direction="column"
          justify="space-between"
          align="center"
          w="xs"
          borderRightWidth="1px"
          px={2}
        >
          <Heading as="h1" size="lg">
            Users@{room}
          </Heading>
          <UnorderedList>
            {users.map(
              (user: User): JSX.Element => {
                return (
                  <ListItem key={`roomUsers-${user.id}`}>
                    {user.name}
                    {user.name === name ? ` (you)` : ""}
                  </ListItem>
                );
              }
            )}
          </UnorderedList>
          <NextLink href="/">
            <Button colorScheme="teal" variant="outline" isFullWidth>
              Home
            </Button>
          </NextLink>
        </Flex>

        <Flex
          w="full"
          px={2}
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex direction="column" overflowY="scroll" grow={2} pr={1}>
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
          <Flex as="form" onSubmit={handleLogin} mt={1}>
            <Input
              placeholder="message"
              variant="filled"
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
