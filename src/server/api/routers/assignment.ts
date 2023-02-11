import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const assignmentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        client: z.object({
          id: z.string({ required_error: "Obrigatório" }),
          label: z.string().optional(),
        }),
        technic: z.object({
          id: z.string({ required_error: "Obrigatório" }),
          label: z.string().optional(),
        }),
        shop: z.object({
          id: z.string({ required_error: "Obrigatório" }),
          label: z.string().optional(),
        }),
        service: z.object({
          id: z.string({ required_error: "Obrigatório" }),
          label: z.string().optional(),
        }),
        dateActivity: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lastPosition = await ctx.prisma.assignment.findMany({
        where: {
          technicId: input.technic.id,
          shopId: input.shop.id,
          dateActivity: input.dateActivity,
        },
        orderBy: {
          position: "desc",
        },
      });
      const position = (lastPosition?.[0]?.position ?? 0) + 1;

      return ctx.prisma.assignment.create({
        data: {
          clientId: input.client.id,
          dateActivity: input.dateActivity,
          serviceId: input.service.id,
          position,
          technicId: input.technic.id,
          status: "PENDING",
          shopId: input.shop.id,
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
