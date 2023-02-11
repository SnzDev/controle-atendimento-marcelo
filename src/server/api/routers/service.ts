import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const serviceRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.service.findMany({
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
      return ctx.prisma.service.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.create({ data: { name: input.name } });
    }),
  update: protectedProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  inativate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.update({
        where: { id: input.id },
        data: { deletedAt: new Date(), deletedBy: ctx.session.user.id },
      });
    }),
  activate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.service.update({
        where: { id: input.id },
        data: { deletedAt: null, deletedBy: null },
      });
    }),
});
