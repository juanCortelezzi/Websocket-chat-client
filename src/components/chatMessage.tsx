import { Box, Text } from "@chakra-ui/react";
import { useMain } from "@/context/contexts";
import { ForwardedRef, forwardRef } from "react";
import { RoomMessage } from "types";

const ChatMessageRef = forwardRef(
  (
    { msg }: { msg: RoomMessage },
    ref: ForwardedRef<HTMLDivElement>
  ): JSX.Element => {
    const [name, _room, _setName, _setRoom] = useMain();
    return (
      <Box ref={ref} maxW="sm" mt={1}>
        <Text fontSize="xs" opacity=".7">
          {msg.from === name ? "you" : msg.from}
        </Text>
        <Text
          fontSize="sm"
          p=".4rem .8rem"
          borderRadius="15px"
          backgroundColor={msg.from === name ? "teal.500" : "blue.500"}
          color="white"
          display="inline"
        >
          {msg.message}
        </Text>
      </Box>
    );
  }
);

export default ChatMessageRef;
