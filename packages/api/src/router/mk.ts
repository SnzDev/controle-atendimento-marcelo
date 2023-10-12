import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { loginSac } from "../mkServices/loginSac";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getInvoiceBarNumber } from "../mkServices/getInvoiceBarNumber";
import { getPendingInvoices } from "../mkServices/getPendingInvoices";
import { getInvoicePdf } from "../mkServices/getInvoicePdf";
import { getClientInfo } from "../mkServices/getClientInfo";
import { getConnections } from "../mkServices/getConnections";
import { getContracts } from "../mkServices/getContracts";
import { auth } from "../mkServices/auth";
import moment from "moment";
import { type PrismaClient } from "@acme/db";

const mkGetToken = async (prisma: PrismaClient) => {
  const token = await prisma.sessionMk.findFirst({
    where: { personName: 'mk', expires: { gte: new Date() } },
  });
  if (!token) {
    const login = await auth();
    if (login.status !== "OK")
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: login.Mensagem ?? "Algo deu errado",
      });
    return await prisma.sessionMk.create({
      data: {
        personCode: login.Token,
        personName: 'mk',
        expires: moment(login.Expire, 'DD/MM/YYYY HH:mm:ss').toDate(),
      },
    });
  }

  return token;
}
export const mkRouter = createTRPCRouter({
  loginSac: publicProcedure
    .input(z.object({ user_sac: z.string(), pass_sac: z.string() }))
    .mutation(async ({ input, ctx }) => {

      const token = await mkGetToken(ctx.prisma);
      const data = await loginSac({ ...input, token: token.personCode });
      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.Mensagem ?? "Algo deu errado",
        });

      const info = await ctx.prisma.sessionMk.findFirst({
        where: {
          personCode: data.CodigoPessoa.toString(),
          expires: { gte: new Date() },
        },
      });
      if (info) return info;

      const expires = new Date();
      expires.setDate(expires.getDate() + 2);

      const session = await ctx.prisma.sessionMk.create({
        data: {
          personCode: data.CodigoPessoa.toString(),
          personName: data.Nome,
          expires,
        },
      });

      return session;
    }),
  getInvoiceBarNumber: publicProcedure
    .input(z.object({ cd_fatura: z.number(), session: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.sessionMk.findFirst({
        where: { id: input.session, expires: { gte: new Date() } },
      });
      const token = await mkGetToken(ctx.prisma);

      if (!session)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessão inválida",
        });

      const data = await getInvoiceBarNumber({
        cd_fatura: input.cd_fatura,
        token: token.personCode,
      });

      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.Mensagem ?? "Algo deu errado",
        });

      if (session.personCode !== data.DadosFatura[0].codigopessoa.toString())
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fatura não encontrada!",
        });

      return data;
    }),
  getPendingInvoices: publicProcedure
    .input(z.object({ session: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.sessionMk.findFirst({
        where: { id: input.session, expires: { gte: new Date() } },
      });
      if (!session)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessão inválida",
        });
      const token = await mkGetToken(ctx.prisma);

      const data = await getPendingInvoices({
        cd_cliente: Number(session.personCode),
        token: token.personCode,
      });

      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.Mensagem ?? "Algo deu errado",
        });

      return data;
    }),
  getInvoicePdf: publicProcedure
    .input(z.object({ cd_fatura: z.number(), session: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.sessionMk.findFirst({
        where: { id: input.session, expires: { gte: new Date() } },
      });
      if (!session)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessão inválida",
        });

      const token = await mkGetToken(ctx.prisma);

      const data = await getInvoicePdf({
        cd_fatura: input.cd_fatura,
        token: token.personCode,
      });

      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.Mensagem ?? "Algo deu errado",
        });

      return data;
    }),
  getClientInfo: publicProcedure
    .input(z.object({ session: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.sessionMk.findFirst({
        where: { id: input.session, expires: { gte: new Date() } },
      });
      if (!session)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessão inválida",
        });

      const token = await mkGetToken(ctx.prisma);

      const data = await getClientInfo({
        id: Number(session.personCode),
        token: token.personCode,
      })

      if (!data)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cliente não encontrado!",
        });

      return data;
    }),
  getConnections: publicProcedure
    .input(z.object({ session: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.sessionMk.findFirst({
        where: { id: input.session, expires: { gte: new Date() } },
      });
      if (!session)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessão inválida",
        });

      const token = await mkGetToken(ctx.prisma);

      const data = await getConnections({
        personCode: Number(session.personCode),
        token: token.personCode,
      })

      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cliente não encontrado!",
        });

      return data;
    }),

  getContracts: publicProcedure
    .input(z.object({ session: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await ctx.prisma.sessionMk.findFirst({
        where: { id: input.session, expires: { gte: new Date() } },
      });
      if (!session)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessão inválida",
        });

      const token = await mkGetToken(ctx.prisma);

      const data = await getContracts({
        personCode: Number(session.personCode),
        token: token.personCode,
      })

      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cliente não encontrado!",
        });

      return data;
    }),

});
