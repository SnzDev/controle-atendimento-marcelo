import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { loginSac } from "../mkServices/loginSac";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getInvoiceBarNumber } from "../mkServices/getInvoiceBarNumber";
import { getPendingInvoices } from "../mkServices/getPendingInvoices";
import { getInvoicePdf } from "../mkServices/getInvoicePdf";
import { getClientInfo } from "../mkServices/getClientInfo";

export const mkRouter = createTRPCRouter({
  loginSac: publicProcedure
    .input(z.object({ user_sac: z.string(), pass_sac: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = await loginSac(input);
      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.Mensagem ?? "Algo deu errado",
        });

      const info = await ctx.prisma.sessionMk.findFirst({
        where: {
          personCode: data.CodigoPessoa,
          expires: { gte: new Date() },
        },
      });
      if (info) return info;

      const expires = new Date();
      expires.setDate(expires.getDate() + 2);

      const session = await ctx.prisma.sessionMk.create({
        data: {
          personCode: data.CodigoPessoa,
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
      if (!session)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessão inválida",
        });

      const data = await getInvoiceBarNumber({
        cd_fatura: input.cd_fatura,
      });

      if (data.status !== "OK")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.Mensagem ?? "Algo deu errado",
        });

      if (session.personCode !== data.DadosFatura[0].codigopessoa)
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

      const data = await getPendingInvoices({
        cd_cliente: session.personCode,
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

      const data = await getInvoicePdf({
        cd_fatura: input.cd_fatura,
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

      const data = await getClientInfo({
        id: session.personCode,
      })

      if (!data)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cliente não encontrado!",
        });

      return data;
    }),
});
