import * as bcrypt from "bcrypt";
import { z } from "zod";

import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          name: { contains: input.name },
        },
      });
    }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!data)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });

      const { password, ...user } = data;
      return user;
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
        role: z.enum([UserRole.ADMIN, UserRole.TECH, UserRole.USER]),
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
        await ctx.prisma.log.create({
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
        await ctx.prisma.log.create({
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
        await ctx.prisma.log.create({
          data: {
            description: `Ativou o usuario de Id: ${activate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return activate;
    }),
});
