import { TokenInfo } from "@solana/spl-token-registry";
import axios from "axios";

export const addTokenToRegistry = (token: TokenInfo) => {
  return axios.post("/api/add-token-to-registry", token);
};
