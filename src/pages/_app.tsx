import { AppProps } from "next/app";
import { SocketProvider } from "@/context/socketContext";
import { ChakraProvider } from "@chakra-ui/react";
import { MainProvider } from "@/context/mainContext";
import { UserProvider } from "@/context/userContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SocketProvider>
      <UserProvider>
        <MainProvider>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </MainProvider>
      </UserProvider>
    </SocketProvider>
  );
}

export default MyApp;
