import { createMint, getMint } from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { createConnection } from "../connection";
import { airDropToPublicKey } from "./airdrop";

test("fungible token can be created!", async () => {
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();
  const connection = createConnection("devnet");
  const balance = await connection.getBalance(payer.publicKey);
  if (!balance) await airDropToPublicKey(payer.publicKey, connection);
  //add set timeout to wait for airdrop to finalize
  setTimeout(async () => {
    const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9,
    );
    const mintInfo = await getMint(connection, mint);

    expect(mintInfo.supply).toEqual(BigInt(0));
  }, 2000);
}, 30000);
