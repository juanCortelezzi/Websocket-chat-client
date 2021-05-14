import { Box, Text } from "@chakra-ui/react";
import { useMain } from "@/context/contexts";
import { ForwardedRef, forwardRef } from "react";

const ChatMessageRef = forwardRef(
  (
    { from, message }: { from: string; message: string },
    ref: ForwardedRef<HTMLDivElement>
  ): JSX.Element => {
    const [name, _room, _setName, _setRoom] = useMain();
    return (
      <Box
        ref={ref}
        maxW="sm"
        mt={1}
        alignSelf={from === name ? "flex-end" : "flex-start"}
      >
        <Text
          fontSize="xs"
          opacity=".7"
          align={from === name ? "right" : "left"}
        >
          {from === name ? "you" : from}
        </Text>
        <Text
          fontSize="sm"
          p=".4rem .8rem"
          borderRadius="15px"
          backgroundColor={from === name ? "teal.500" : "blue.500"}
          color="white"
          display="inline"
        >
          {message}
        </Text>
      </Box>
    );
  }
);

export default ChatMessageRef;
