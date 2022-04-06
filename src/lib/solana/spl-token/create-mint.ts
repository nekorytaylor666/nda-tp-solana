import {
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Keypair,
  ConfirmOptions,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

export async function createMintWithWallet(
  wallet: WalletContextState,
  connection: Connection,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  decimals: number,
  keypair = Keypair.generate(),
  confirmOptions?: ConfirmOptions,
  programId = TOKEN_PROGRAM_ID,
): Promise<PublicKey> {
  const { publicKey, signTransaction, connected } = wallet;
  if (connected && publicKey && wallet && signTransaction) {
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: keypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId,
      }),
      createInitializeMintInstruction(
        keypair.publicKey,
        decimals,
        mintAuthority,
        freezeAuthority,
        programId,
      ),
    );
    const { blockhash } = await connection.getLatestBlockhash("finalized");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;
    const signedTransaction = await signTransaction(transaction);
    signedTransaction.partialSign(keypair);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );

    const res = await connection.confirmTransaction(signature, "processed");
    console.log(res);

    return keypair.publicKey;
  } else {
    throw WalletNotConnectedError;
  }
}
