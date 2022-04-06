import web3, { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const airDropToPublicKey = async (
  publicKey: PublicKey,
  connection: web3.Connection,
): Promise<string> => {
  const airdropSignature = await connection.requestAirdrop(
    publicKey,
    LAMPORTS_PER_SOL,
  );
  return airdropSignature;
};
