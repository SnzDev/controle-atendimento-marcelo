import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const labelRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.label.findMany();
  }),
  findOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.label.findUnique({ where: { id: input.id } });
    }),
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.create({ data: { name: input.name } });
    }),
  update: publicProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  inativate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });
    }),
  activate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.update({
        where: { id: input.id },
        data: { deletedAt: null, deletedBy: null },
      });
    }),
});
