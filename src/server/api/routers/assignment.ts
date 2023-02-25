/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { z } from "zod";
import { changeStatusPortuguese } from "../../../utils/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
        dateActivity: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const date = moment(input.dateActivity).format("YYYY-MM-DD");
      const lastPosition = await ctx.prisma.assignment.findFirst({
        where: {
          technicId: input.technic.id,
          shopId: input.shop.id,
          dateActivity: new Date(date),
        },
        orderBy: {
          position: "desc",
        },
      });
      const position = (lastPosition?.position ?? 0) + 1;

      const data = await ctx.prisma.assignment.create({
        data: {
          clientId: input.client.id,
          dateActivity: new Date(date),
          serviceId: input.service.id,
          position,
          technicId: input.technic.id,
          status: "PENDING",
          shopId: input.shop.id,
        },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: data.id,
          userId: ctx.session.user.id,
          description: `Criou o atendimento para a data ${moment(date).format(
            "DD/MM/YYYY"
          )}`,
        },
      });
      return data;
    }),
  getAssignments: protectedProcedure
    .input(
      z.object({ shopId: z.string().nullable(), dateActivity: z.string() })
    )
    .query(async ({ ctx, input }) => {
      if (!input.shopId || !moment(input.dateActivity).isValid()) return;
      const technics = await ctx.prisma.assignment.findMany({
        where: {
          dateActivity: new Date(
            moment(input.dateActivity).format("YYYY-MM-DD")
          ),
          shopId: input.shopId,
        },
        include: {
          technic: true,
          shop: true,
          service: true,
          client: true,
          HistoryAssignment: {
            include: { userAction: true },
          },
          observation: {
            include: {
              userAction: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      });
      const allPendingAssignments = await ctx.prisma.assignment.findMany({
        where: {
          shopId: input.shopId,
          dateActivity: {
            lt: new Date(moment(input.dateActivity).format("YYYY-MM-DD")),
          },
          OR: [
            {
              status: "IN_PROGRESS",
            },
            {
              status: "PENDING",
            },
          ],
        },
        include: {
          technic: true,
          shop: true,
          service: true,
          client: true,
          HistoryAssignment: {
            include: { userAction: true },
          },
          observation: {
            include: {
              userAction: true,
            },
          },
        },
      });

      const data: {
        techId: string;
        assignments: typeof technics;
      }[] = [];

      allPendingAssignments?.map((item) => {
        const index = data.findIndex((data) => data.techId === item.technicId);
        if (index !== -1)
          if (data[index]?.assignments)
            return (data[index] = {
              techId: item.technicId,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              assignments: [...data?.[index]?.assignments, item],
            });

        data.push({ techId: item.technicId, assignments: [item] });
      });

      technics?.map((item) => {
        const index = data.findIndex((data) => data.techId === item.technicId);
        if (index !== -1)
          if (data[index]?.assignments)
            return (data[index] = {
              techId: item.technicId,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      const data = await ctx.prisma.assignment.update({
        where: { id: assignment.id },
        data: {
          position: assignment.position - 1,
        },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: data.id,
          userId: ctx.session.user.id,
          description: `Moveu para cima da posição ${
            assignment.position
          } para a posição ${assignment.position - 1}`,
        },
      });

      return data;
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
      const data = await ctx.prisma.assignment.update({
        where: { id: assignment.id },
        data: {
          position: assignment.position + 1,
        },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: data.id,
          userId: ctx.session.user.id,
          description: `Moveu para cima da posição ${
            assignment.position
          } para a posição ${assignment.position + 1}`,
        },
      });

      return data;
    }),
  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "IN_PROGRESS", "FINALIZED", "CANCELED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id: input.id },
      });
      if (!assignment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Não existe esse atendimento",
        });

      const data = await ctx.prisma.assignment.update({
        where: { id: input.id },
        data:
          input.status === "FINALIZED"
            ? { status: input.status, finalizedAt: new Date() }
            : { status: input.status },
      });

      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: input.id,
          userId: ctx.session.user.id,
          description: `Alterou o status de ${changeStatusPortuguese({
            status: assignment.status,
          })} para ${changeStatusPortuguese({ status: input.status })}`,
        },
      });
      return data;
    }),
  changeTechnic: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        technicId: z.string(),
        dateActivity: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id: input.id },
        include: {
          technic: true,
        },
      });
      if (!assignment) return;
      const allAssignmentsBehind = await ctx.prisma.assignment.findMany({
        where: {
          technicId: assignment.technicId,
          dateActivity: assignment.dateActivity,
          shopId: assignment.shopId,
          position: {
            lt: assignment.position,
          },
        },
      });
      allAssignmentsBehind.forEach(
        async (item) =>
          await ctx.prisma.assignment.update({
            where: {
              id: item.id,
            },
            data: {
              position: item.position - 1,
            },
          })
      );
      const lastPosition = await ctx.prisma.assignment.findMany({
        where: {
          shopId: assignment?.shopId,
          dateActivity: assignment?.dateActivity,
          technicId: input.technicId,
        },
        orderBy: {
          position: "desc",
        },
      });

      const data = await ctx.prisma.assignment.update({
        where: { id: input.id },
        data: {
          technicId: input.technicId,
          position: (lastPosition?.[0]?.position ?? 0) + 1,
          dateActivity: input.dateActivity
            ? new Date(input.dateActivity)
            : assignment?.dateActivity,
        },
        include: {
          technic: true,
        },
      });

      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: assignment.id,
          userId: ctx.session.user.id,
          description: input.dateActivity
            ? `Fixou na data ${moment(input.dateActivity).format("DD/MM/YYYY")}`
            : `Trocou do técnico ${assignment.technic.name} para o técnico ${data.technic.name}`,
        },
      });

      return data;
    }),
});
