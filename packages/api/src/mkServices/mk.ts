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
    token: "b125f49a1d81292f087b8a1944860c5e.929260" ?? process.env.MK_API_KEY,
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
