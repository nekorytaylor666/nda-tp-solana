import {
  Badge,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Spacer,
  Stack,
  Text,
  toast,
  VStack,
} from "@chakra-ui/react";
import { Header, Main, Cards, Footer, Button, Input } from "@components";
import { getMint } from "@solana/spl-token";

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useFormik } from "formik";
import React, { FC, useCallback, useState } from "react";
import { useMutation } from "react-query";
import { addTokenToRegistry } from "src/lib/requests/mutations/add-token-to-registry";
import { createMintWithWallet } from "src/lib/solana/spl-token/create-mint";
import { getOrCreateAssociatedTokenAccount } from "src/lib/solana/spl-token/getOrCreateAssociatedTokenAccount";
import { mintTo } from "src/lib/solana/spl-token/mintTo";
import { useToast } from "@chakra-ui/react";
import { useClipboard } from "@chakra-ui/react";

const Home: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const [tokenAddress, setTokenAddress] = useState("");
  const { publicKey, signTransaction } = wallet;
  const { hasCopied, onCopy } = useClipboard(tokenAddress);

  const { isLoading, isSuccess, mutate } = useMutation(addTokenToRegistry, {
    onSuccess() {
      toast({
        title: "Token created.",
        description: "We've created token for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    },
  });
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      tokenName: "",
      supply: 1,
      projectName: "",
      logoUrl: "",
      decimals: 0,
    },
    onSubmit: async (values) => {
      if (!publicKey || !signTransaction) return;
      //initializing mint and use our phantom wallet as a payer
      const mint = await createMintWithWallet(
        wallet,
        connection,
        publicKey,
        publicKey,
        0,
      );
      //create account for supply of token
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint,
        publicKey,
        signTransaction,
      );
      if (!tokenAccount?.address) return;
      //mint supply to token account
      const signature = await mintTo(
        wallet,
        connection,
        publicKey,
        mint,
        tokenAccount?.address,
        publicKey,
        BigInt(values.supply),
      );
      const address = tokenAccount.address.toBase58();
      //add token to registry
      mutate({
        chainId: 101,
        address,
        symbol: values.tokenName,
        name: values.projectName,
        decimals: values.decimals,
        logoURI: values.logoUrl,
        tags: ["utility-token"],
      });
      setTokenAddress(address);
    },
  });

  return (
    <Center>
      <Flex direction={"column"}>
        {tokenAddress && (
          <Flex mb={2} alignItems="center" justifyContent={"center"}>
            <Text fontSize="xl" fontWeight="bold">
              New Token: {tokenAddress}
            </Text>{" "}
            <Button onClick={onCopy} ml={2}>
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </Flex>
        )}
        <form onSubmit={handleSubmit}>
          <VStack w={"container.lg"} gap={4}>
            <FormControl>
              <FormLabel fontWeight="bold" color="white" htmlFor="logoUrl">
                Image url
              </FormLabel>
              <Input
                value={values.logoUrl}
                id="logoUrl"
                onChange={handleChange}
                name="logoUrl"
                type="text"
              />
              <FormHelperText textColor={"lightGray"}>
                Name of your future token.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white" htmlFor="tokenName">
                Token name
              </FormLabel>
              <Input
                value={values.tokenName}
                id="tokenName"
                onChange={handleChange}
                name="tokenName"
                type="text"
              />
              <FormHelperText textColor={"lightGray"}>
                Name of your future token.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white" htmlFor="projectName">
                Project name
              </FormLabel>
              <Input
                value={values.projectName}
                id="projectName"
                onChange={handleChange}
                name="projectName"
                type="text"
              />
              <FormHelperText textColor={"lightGray"}>
                Name of your future token.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white" htmlFor="supply">
                Supply amount
              </FormLabel>
              <Input
                id="supply"
                value={values.supply}
                onChange={handleChange}
                name="supply"
                type="number"
              />
              <FormHelperText textColor={"lightGray"}>
                How many tokens do you want to issue.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white" htmlFor="decimals">
                Decimals
              </FormLabel>
              <Input
                id="decimals"
                value={values.decimals}
                onChange={handleChange}
                name="decimals"
                type="number"
              />
              <FormHelperText textColor={"lightGray"}>
                How many tokens do you want to issue.
              </FormHelperText>
            </FormControl>
            <Button type="submit">Create token</Button>
          </VStack>
        </form>
      </Flex>
    </Center>
  );
};

export default Home;
