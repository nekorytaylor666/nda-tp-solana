import { Box, Flex } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { FC } from "react";

const DefaultLayout: FC = (props) => {
  const { children } = props;
  return (
    <Box bg="backgroundBlack" minHeight={"100vh"}>
      <Flex p={4} justifyContent={"flex-end"}>
        <WalletMultiButton />
      </Flex>
      <Box>{children}</Box>
    </Box>
  );
};

export default DefaultLayout;
