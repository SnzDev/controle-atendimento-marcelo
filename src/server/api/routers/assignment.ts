import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const clientRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        dateActivity: z.date(),
        labelId: z.string(),
        technicId: z.string(),
        shopId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lastPosition = await ctx.prisma.assignment.findMany({
        where: {
          technicId: input.technicId,
          shopId: input.shopId,
          dateActivity: input.dateActivity,
        },
        orderBy: {
          position: "desc",
        },
      });
      const position = (lastPosition?.[0]?.position ?? 0) + 1;

      return ctx.prisma.assignment.create({
        data: {
          clientId: input.clientId,
          dateActivity: input.dateActivity,
          labelId: input.labelId,
          position,
          technicId: input.technicId,
          status: "PENDING",
          shopId: input.shopId,
        },
      });
    }),
  getAssignments: protectedProcedure
    .input(z.object({ shopId: z.string(), dayActivity: z.date() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.assignment.findMany({
        where: { dateActivity: input.dayActivity, shopId: input.shopId },
        orderBy: { position: "asc" },
      });
    }),
});
