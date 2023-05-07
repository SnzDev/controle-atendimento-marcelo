import axios from "axios";

export const mk = axios.create({
  baseURL: process.env.MK_API_URL,
});

mk.interceptors.request.use((config) => {
  //let credentials = config.params?.token;
  //if (!credentials) {
  //  credentials = (await auth()).data;
  //}

  config.params = {
    token: process.env.MK_API_KEY,
    sys: "MK0",
  };
  return config;
});

export interface MkCustomError {
  status: "ERRO";
  Mensagem: string;
  CodToken: string;
  "Num. ERRO": string;
}
