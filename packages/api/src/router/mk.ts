import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { loginSac } from "../mkServices/loginSac";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
});
