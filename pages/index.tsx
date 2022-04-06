import {
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Spacer,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Header, Main, Cards, Footer, Button, Input } from "@components";
import { getMint } from "@solana/spl-token";

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useFormik } from "formik";
import React, { FC, useCallback } from "react";
import { useMutation } from "react-query";
import { addTokenToRegistry } from "src/lib/requests/mutations/add-token-to-registry";
import { createMintWithWallet } from "src/lib/solana/spl-token/create-mint";
import { getOrCreateAssociatedTokenAccount } from "src/lib/solana/spl-token/getOrCreateAssociatedTokenAccount";
import { mintTo } from "src/lib/solana/spl-token/mintTo";

export const SendOneLamportToRandomAddress: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1,
      }),
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, "processed");
  }, [publicKey, sendTransaction, connection]);

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Create token
    </Button>
  );
};
const Home: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;
  const { isLoading, isSuccess, mutate } = useMutation(addTokenToRegistry, {
    onSuccess() {
      alert("success");
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
      const mint = await createMintWithWallet(
        wallet,
        connection,
        publicKey,
        publicKey,
        0,
      );
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint,
        publicKey,
        signTransaction,
      );
      if (!tokenAccount?.address) return;
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
      const mintInfo = await getMint(connection, mint);
      mutate({
        chainId: 101,
        address,
        symbol: values.tokenName,
        name: values.projectName,
        decimals: values.decimals,
        logoURI: values.logoUrl,
        tags: ["utility-token"],
      });
    },
  });

  return (
    <Center>
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
    </Center>
  );
};

export default Home;
