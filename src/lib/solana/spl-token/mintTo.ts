import {
  TOKEN_PROGRAM_ID,
  mintToInstructionData,
  TokenInstruction,
} from "@solana/spl-token";
import {
  WalletNotConnectedError,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  ConfirmOptions,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { addSigners } from "./addSigners";
import { getSigners } from "./getSigners";

export function createMintToInstruction(
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey,
  amount: number | bigint,
  multiSigners: Signer[] = [],
  programId = TOKEN_PROGRAM_ID,
): TransactionInstruction {
  const keys = addSigners(
    [
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: destination, isSigner: false, isWritable: true },
    ],
    authority,
    multiSigners,
  );

  const data = Buffer.alloc(mintToInstructionData.span);
  mintToInstructionData.encode(
    {
      instruction: TokenInstruction.MintTo,
      amount: BigInt(amount),
    },
    data,
  );

  return new TransactionInstruction({ keys, programId, data });
}

export async function mintTo(
  wallet: WalletContextState,
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  destination: PublicKey,
  authority: Signer | PublicKey,
  amount: number | bigint,
  multiSigners: Signer[] = [],
  confirmOptions?: ConfirmOptions,
  programId = TOKEN_PROGRAM_ID,
): Promise<TransactionSignature> {
  const { signTransaction } = wallet;
  const [authorityPublicKey, signers] = getSigners(authority, multiSigners);
  const transaction = new Transaction().add(
    createMintToInstruction(
      mint,
      destination,
      authorityPublicKey,
      amount,
      multiSigners,
      programId,
    ),
  );

  const blockHash = await connection.getRecentBlockhash();
  transaction.feePayer = await payer;
  transaction.recentBlockhash = await blockHash.blockhash;
  const signed = await signTransaction(transaction);

  const signature = await connection.sendRawTransaction(signed.serialize());

  await connection.confirmTransaction(signature);
  return signature;
}
