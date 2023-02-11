import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const shopRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.shop.findMany();
  }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.shop.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), city: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shop.create({
        data: { name: input.name, city: input.city },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string(),
        city: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shop.update({
        where: { id: input.id },
        data: { name: input.name, city: input.city },
      });
    }),
  inativate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shop.update({
        where: { id: input.id },
        data: { deletedAt: new Date(), deletedBy: ctx.session.user.id },
      });
    }),
  activate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shop.update({
        where: { id: input.id },
        data: { deletedAt: null, deletedBy: null },
      });
    }),
});
