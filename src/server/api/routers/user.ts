import { z } from "zod";
import * as bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string({ required_error: "Obrigatório" })
          .min(3, "No minímo 3 caracteres"),
        email: z
          .string({ required_error: "Obrigatório" })
          .email("Email inválido"),
        password: z
          .string({ required_error: "Obrigatório" })
          .min(8, "No minímo 8 caracteres"),
      })
    )
    .mutation(async ({ ctx, input: { password, ...input } }) => {
      const existsUserWithEmail = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });
      if (existsUserWithEmail)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "E-mail já em uso",
        });
      const saltRounds = 10;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const encryptedPassword = bcrypt.hashSync(password, saltRounds);

      const created = await ctx.prisma.user.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { password: encryptedPassword, ...input },
      });
      if (created)
        await ctx.prisma.history.create({
          data: {
            description: `Criou o usuario de Id: ${created.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return created;
    }),
  inativate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const inactivate = await ctx.prisma.user.update({
        where: { id: input.id },
        data: { deletedAt: new Date(), deletedBy: ctx.session.user.id },
      });
      if (inactivate)
        await ctx.prisma.history.create({
          data: {
            description: `Inativou o usuario de Id: ${inactivate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return inactivate;
    }),
  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const activate = await ctx.prisma.user.update({
        where: { id: input.id },
        data: { deletedAt: null, deletedBy: null },
      });
      if (activate)
        await ctx.prisma.history.create({
          data: {
            description: `Ativou o usuario de Id: ${activate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return activate;
    }),
});
