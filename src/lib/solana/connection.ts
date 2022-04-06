import web3, { Cluster, Connection, clusterApiUrl } from "@solana/web3.js";

export const createConnection = (cluster: Cluster = "devnet"): Connection => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  return connection;
};
