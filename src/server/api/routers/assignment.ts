/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AssignmentStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
      const lastPosition = await ctx.prisma.assignment.findFirst({
        where: {
          technicId: input.technic.id,
          shopId: input.shop.id,
          dateActivity: input.dateActivity,
        },
        orderBy: {
          position: "desc",
        },
      });
      const position = (lastPosition?.position ?? 0) + 1;

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
        orderBy: {
          position: "asc",
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id: input.id },
      });
      if (!assignment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Atendimento não encontrado",
        });

      const assignmentUp = await ctx.prisma.assignment.findFirst({
        where: {
          technicId: assignment.technicId,
          shopId: assignment.shopId,
          dateActivity: assignment.dateActivity,
          position: assignment.position - 1,
        },
      });
      if (!assignmentUp)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Atendimento já encontra-se em primeiro",
        });
      await ctx.prisma.assignment.update({
        where: { id: assignmentUp.id },
        data: {
          position: assignmentUp.position + 1,
        },
      });
      return await ctx.prisma.assignment.update({
        where: { id: assignment.id },
        data: {
          position: assignment.position - 1,
        },
      });
    }),
  positionDown: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id: input.id },
      });

      if (!assignment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Atendimento não encontrado",
        });

      const assignmentDown = await ctx.prisma.assignment.findFirst({
        where: {
          technicId: assignment.technicId,
          shopId: assignment.shopId,
          dateActivity: assignment.dateActivity,
          position: assignment.position + 1,
        },
      });
      if (!assignmentDown)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Atendimento já encontra-se em ultimo",
        });
      await ctx.prisma.assignment.update({
        where: { id: assignmentDown.id },
        data: {
          position: assignmentDown.position - 1,
        },
      });
      return await ctx.prisma.assignment.update({
        where: { id: assignment.id },
        data: {
          position: assignment.position + 1,
        },
      });
    }),
  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "IN_PROGRESS", "FINALIZED", "CANCELED"]),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.assignment.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
