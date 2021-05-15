import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import {
  UsersProvider,
  SocketProvider,
  MainProvider,
} from "@/context/contexts";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SocketProvider>
      <UsersProvider>
        <MainProvider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </MainProvider>
      </UsersProvider>
    </SocketProvider>
  );
}

export default MyApp;
