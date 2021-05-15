import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import {
  UsersProvider,
  SocketProvider,
  MainProvider,
} from "@/context/contexts";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SocketProvider>
      <UsersProvider>
        <MainProvider>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </MainProvider>
      </UsersProvider>
    </SocketProvider>
  );
}

export default MyApp;
