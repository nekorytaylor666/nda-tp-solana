import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import { StyledThemeProvider } from "@definitions/styled-components";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { RecoilRoot } from "recoil";
import "@fontsource/inter";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const queryClient = new QueryClient();
  return (
    <ChakraProvider theme={theme}>
      <StyledThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <RecoilRoot>
              <Component {...pageProps} />
            </RecoilRoot>
          </Hydrate>
        </QueryClientProvider>
      </StyledThemeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
