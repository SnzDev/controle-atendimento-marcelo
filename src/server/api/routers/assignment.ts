/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
    .input(z.object({ shopId: z.string(), dateActivity: z.string() }))
    .query(async ({ ctx, input }) => {
      const technics = await ctx.prisma.assignment.findMany({
        where: {
          // dateActivity: input.dateActivity,
          shopId: input.shopId,
        },
        include: {
          technic: true,
          shop: true,
          service: true,
          client: true,
        },
      });
      const data: {
        techId: string;
        assignments: typeof technics;
      }[] = [];
      technics?.map((item) => {
        const index = data.findIndex((data) => data.techId === item.technicId);
        if (index !== -1)
          if (data[index]?.assignments)
            return (data[index] = {
              techId: item.technicId,
              //@ts-ignore
              assignments: [...data?.[index]?.assignments, item],
            });

        data.push({ techId: item.technicId, assignments: [item] });
      });

      return data;
    }),
  positionUp: protectedProcedure
    .input(z.object({id: z.string()}))
    .
});
