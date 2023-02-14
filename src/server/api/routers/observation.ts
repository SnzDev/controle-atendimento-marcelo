import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const observationRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.observation.findMany({
        where: {
          assignmentId: input.assignmentId,
        },
        include: {
          userAction: true,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ observation: z.string(), assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.prisma.observation.create({
        data: {
          observation: input.observation,
          assignmentId: input.assignmentId,
          userId: ctx.session.user.id,
        },
      });
      if (created)
        await ctx.prisma.history.create({
          data: {
            description: `Criou a observação de Id: ${created.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return created;
    }),
  update: protectedProcedure
    .input(z.object({ observation: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.observation.update({
        where: { id: input.id },
        data: { observation: input.observation },
      });
      if (update)
        await ctx.prisma.history.create({
          data: {
            description: `Atualizou a observação de Id: ${update.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return update;
    }),
  inativate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const inactivate = await ctx.prisma.observation.update({
        where: { id: input.id },
        data: { deletedAt: new Date(), deletedBy: ctx.session.user.id },
      });
      if (inactivate)
        await ctx.prisma.history.create({
          data: {
            description: `Inativou a observação de Id: ${inactivate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return inactivate;
    }),
  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const activate = await ctx.prisma.observation.update({
        where: { id: input.id },
        data: { deletedAt: null, deletedBy: null },
      });
      if (activate)
        await ctx.prisma.history.create({
          data: {
            description: `Ativou a observação de Id: ${activate.id}!`,
            flag: "SUCCESS",
            userId: ctx.session.user.id,
          },
        });
      return activate;
    }),
});
