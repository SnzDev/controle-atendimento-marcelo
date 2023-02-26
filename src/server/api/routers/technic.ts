import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const technicRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        haveUser: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.technic.findMany({
        where: {
          name: {
            contains: input.name,
          },
          userId:
            input.haveUser === undefined
              ? undefined
              : input.haveUser
              ? {
                  not: null,
                }
              : null,
        },
      });
    }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.technic.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.prisma.technic.create({
        data: { name: input.name },
      });
      if (created)
        await ctx.prisma.log.create({
          data: {
            description: `Criou o tecnico de Id: ${created.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return created;
    }),
  update: protectedProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.technic.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      if (update)
        await ctx.prisma.log.create({
          data: {
            description: `Atualizou o tecnico de Id: ${update.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return update;
    }),
  updateUserId: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;
      const update = await ctx.prisma.technic.update({
        where: { id },
        data: { userId },
      });
      if (update)
        await ctx.prisma.log.create({
          data: {
            description: `Adcionou o usuario: ${userId} ao técnico: ${update.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return update;
    }),
  inativate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const inactivate = await ctx.prisma.technic.update({
        where: { id: input.id },
        data: { deletedAt: new Date(), deletedBy: ctx.session.user.id },
      });
      if (inactivate)
        await ctx.prisma.log.create({
          data: {
            description: `Inativou o tecnico de Id: ${inactivate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return inactivate;
    }),
  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const activate = await ctx.prisma.technic.update({
        where: { id: input.id },
        data: { deletedAt: null, deletedBy: null },
      });
      if (activate)
        await ctx.prisma.log.create({
          data: {
            description: `Ativou o tecnico de Id: ${activate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return activate;
    }),
});
