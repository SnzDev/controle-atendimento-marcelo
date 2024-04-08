import axios from "axios";

import { type MkCustomError } from "./mk";
import { prisma } from "@acme/db";
import moment from "moment";

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


export const mkGetToken = async () => {
  const token = await prisma.sessionMk.findFirst({
    where: { personName: "mk", expires: { gte: new Date() } },
  });
  if (!token) {
    const login = await auth();
    if (login.status !== "OK")
      throw new Error("Error on login");

    return await prisma.sessionMk.create({
      data: {
        personCode: login.Token,
        personName: "mk",
        expires: moment(login.Expire, "DD/MM/YYYY HH:mm:ss").toDate(),
      },
    });
  }

  return token;
};