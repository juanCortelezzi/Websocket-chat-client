import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme";
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
          <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </MainProvider>
      </UsersProvider>
    </SocketProvider>
  );
}

export default MyApp;
