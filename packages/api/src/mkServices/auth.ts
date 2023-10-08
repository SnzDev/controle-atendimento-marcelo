import axios from "axios";

import { type MkCustomError } from "./mk";

export type AuthResponse =
  | {
    Expire: string;
    LimiteUso: number;
    ServicosAtorizados: number[];
    Token: string;
    status: "OK";
  }
  | MkCustomError;

export const auth = async () =>
  axios.get<AuthResponse | MkCustomError>(
    `${process.env.MK_API_URL}/mk/WSAutenticacao.rule`,
    {
      params: {
        token: process.env.MK_API_KEY,
        password: process.env.MK_API_SECRET,
        cd_servico: 9999,
        sys: "MK0",
      },
    },
  ).then(res => res.data)
