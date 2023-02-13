import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const shopRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.shop.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
      });
    }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.shop.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.prisma.shop.create({
        data: { name: input.name },
      });
      if (created)
        await ctx.prisma.history.create({
          data: {
            description: `Criou a revenda de Id: ${created.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return created;
    }),
  update: protectedProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.shop.update({
        where: { id: input.id },
        data: { name: input.name },
      });
      if (update)
        await ctx.prisma.history.create({
          data: {
            description: `Atualizou a revenda de Id: ${update.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return update;
    }),
  inativate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const inactivate = await ctx.prisma.shop.update({
        where: { id: input.id },
        data: { deletedAt: new Date(), deletedBy: ctx.session.user.id },
      });
      if (inactivate)
        await ctx.prisma.history.create({
          data: {
            description: `Inativou a revenda de Id: ${inactivate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return inactivate;
    }),
  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const activate = await ctx.prisma.shop.update({
        where: { id: input.id },
        data: { deletedAt: null, deletedBy: null },
      });
      if (activate)
        await ctx.prisma.history.create({
          data: {
            description: `Ativou a revenda de Id: ${activate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return activate;
    }),
});
