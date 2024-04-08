import axios from "axios";

export const mk = axios.create({
  baseURL: process.env.MK_API_URL,
});

export interface MkCustomError {
  status: "ERRO";
  Mensagem: string;
  CodToken: string;
  "Num. ERRO": string;
}
