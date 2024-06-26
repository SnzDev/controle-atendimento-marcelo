/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Assignment, AssignmentStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

interface ChangeStatusPortugueseProps {
  status: AssignmentStatus;
  isUppercase?: boolean;
}
export function changeStatusPortuguese(props: ChangeStatusPortugueseProps) {
  const status = {
    PENDING: "PENDENTE",
    IN_PROGRESS: "EM ANDAMENTO",
    FINALIZED: "FINALIZADO",
    CANCELED: "CANCELADO",
    INACTIVE: "INATIVO",
  };

  return props.isUppercase
    ? status[props.status]
    : status[props.status].toLowerCase();
}

export const assignmentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        client: z.object({
          id: z.string({ required_error: "Obrigatório" }),
          label: z.string().optional(),
        }),
        user: z.object({
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
        region: z.object({
          id: z.string({ required_error: "Obrigatório" }),
          label: z.string().optional(),
        }),
        dateActivity: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const date = moment(input.dateActivity).format("YYYY-MM-DD");
      const lastPosition = await ctx.prisma.assignment.findFirst({
        where: {
          userId: input.user.id,
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
          userId: input.user.id,
          status: "PENDING",
          shopId: input.shop.id,
          regionId: input.region.id,
          createdBy: userId,
        },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: data.id,
          userId: ctx.session.user.id,
          description: `Criou o atendimento para a data ${moment(date).format(
            "DD/MM/YYYY",
          )}`,
        },
      });
      return data;
    }),
  getAssignments: protectedProcedure
    .input(
      z.object({
        shopId: z.string().nullable(),
        dateActivity: z.string(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isTechnic = ctx.session.user.role === "TECH";
      const userId = input.userId ?? ctx.session.user.id;
      if (
        (!input.shopId && !userId && !isTechnic) ||
        !moment(input.dateActivity).isValid()
      )
        return;

      const technics = await ctx.prisma.assignment.findMany({
        where: {
          dateActivity: new Date(
            moment(input.dateActivity).format("YYYY-MM-DD"),
          ),
          shopId: isTechnic || input.userId ? undefined : input.shopId ?? "",
          userId: isTechnic || input.userId ? userId : undefined,
          OR: isTechnic
            ? [
              {
                status: "IN_PROGRESS",
              },
              {
                status: "PENDING",
              },
            ]
            : undefined,
          deletedAt: {
            equals: null,
          },
        },
        include: {
          userAssignment: true,
          shop: true,
          service: true,
          client: true,
          Region: true,
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
          shopId: isTechnic || input.userId ? undefined : input.shopId ?? "",
          userId: isTechnic || input.userId ? userId : undefined,
          dateActivity: {
            lt: new Date(input.dateActivity),
          },
          OR: [
            {
              status: "IN_PROGRESS",
            },
            {
              status: "PENDING",
            },
          ],
          deletedAt: {
            equals: null,
          },
        },
        include: {
          userAssignment: true,
          shop: true,
          service: true,
          Region: true,
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
        userId: string;
        assignments: typeof technics;
      }[] = [];

      allPendingAssignments?.map((item) => {
        const index = data.findIndex((data) => data.userId === item.userId);
        if (index !== -1)
          if (data[index]?.assignments)
            return (data[index] = {
              userId: item.userId,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              assignments: [...data?.[index]?.assignments, item],
            });

        data.push({ userId: item.userId, assignments: [item] });
      });

      technics?.map((item) => {
        const index = data.findIndex((data) => data.userId === item.userId);
        if (index !== -1)
          if (data[index]?.assignments)
            return (data[index] = {
              userId: item.userId,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              assignments: [...data?.[index]?.assignments, item],
            });

        data.push({ userId: item.userId, assignments: [item] });
      });

      return data;
    }),
  positionUp: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!assignment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Atendimento não encontrado",
        });

      const assignmentUp = await ctx.prisma.assignment.findFirst({
        where: {
          userId: assignment.userId,
          shopId: assignment.shopId,
          dateActivity: assignment.dateActivity,
          position: { lt: assignment.position },
          deletedAt: {
            equals: null,
          },
        },
      });
      if (!assignmentUp)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Atendimento já encontra-se em primeiro",
        });
      await ctx.prisma.assignment.update({
        where: {
          id: assignmentUp.id,
        },
        data: {
          position: assignment.position,
        },
      });
      const data = await ctx.prisma.assignment.update({
        where: { id: assignment.id },
        data: {
          position: assignmentUp.position,
        },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: data.id,
          userId: ctx.session.user.id,
          description: `Moveu para cima da posição ${assignment.position} para a posição ${assignmentUp.position}`,
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
          userId: assignment.userId,
          shopId: assignment.shopId,
          dateActivity: assignment.dateActivity,
          position: { gt: assignment.position },
          deletedAt: {
            equals: null,
          },
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
          position: assignment.position,
        },
      });
      const data = await ctx.prisma.assignment.update({
        where: { id: assignment.id },
        data: {
          position: assignmentDown.position,
        },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: data.id,
          userId: ctx.session.user.id,
          description: `Moveu para cima da posição ${assignment.position
            } para a posição ${assignmentDown.position + 1}`,
        },
      });

      return data;
    }),
  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "PENDING",
          "IN_PROGRESS",
          "FINALIZED",
          "CANCELED",
          "INACTIVE",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id: input.id },
        include: {
          Chat: { select: { id: true } },
        }
      });
      if (!assignment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Não existe esse atendimento",
        });

      let data: Partial<Assignment> = { status: input.status };
      if (input.status === "FINALIZED")
        data = { ...data, finalizedAt: new Date(), finalizedBy: userId };
      if (input.status === "CANCELED") {
        data = {
          ...data,
          canceledAt: new Date(),
          canceledBy: userId,
          finalizedAt: assignment.finalizedAt
            ? assignment.finalizedAt
            : new Date(),
          finalizedBy: assignment.finalizedBy ? assignment.finalizedBy : userId,
        };
      }
      if (input.status === "IN_PROGRESS")
        data = {
          ...data,
          inProgressAt: new Date(),
          canceledBy: null,
          canceledAt: null,
          finalizedAt: null,
          finalizedBy: null,
        };
      if (input.status === "PENDING")
        data = {
          ...data,
          inProgressAt: null,
          canceledBy: null,
          canceledAt: null,
          finalizedAt: null,
          finalizedBy: null,
        };
      if (input.status === "INACTIVE")
        data = {
          ...data,
          deletedAt: new Date(),
          deletedBy: userId,
        };

      const response = await ctx.prisma.assignment.update({
        where: { id: input.id },
        data,
      });

      if (assignment.Chat?.id && input.status === "FINALIZED") {
        await ctx.prisma.whatsappChat.update({
          where: {
            id: assignment.Chat.id
          },
          data: {
            step: "FINISHED"
          }
        })
      }


      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: input.id,
          userId: ctx.session.user.id,
          description: `Alterou o status de ${changeStatusPortuguese({
            status: assignment.status,
          })} para ${changeStatusPortuguese({ status: input.status })}`,
        },
      });
      return response;
    }),
  changeTechnic: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        dateActivity: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id: input.id },
        include: {
          userAssignment: true,
        },
      });
      if (!assignment) return;
      const actualTechnic = await ctx.prisma.user.findUnique({
        where: { id: assignment.userId },
      });
      const newTechnic = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!actualTechnic || !newTechnic) return;

      const allAssignmentsBehind = await ctx.prisma.assignment.findMany({
        where: {
          userId: assignment.userId,
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
          }),
      );
      const lastPosition = await ctx.prisma.assignment.findMany({
        where: {
          shopId: assignment?.shopId,
          dateActivity: assignment?.dateActivity,
          userId: input.userId,
        },
        orderBy: {
          position: "desc",
        },
      });

      const data = await ctx.prisma.assignment.update({
        where: { id: input.id },
        data: {
          userId: input.userId,
          position: (lastPosition?.[0]?.position ?? 0) + 1,
          dateActivity: input.dateActivity
            ? new Date(input.dateActivity)
            : assignment?.dateActivity,
        },
        include: {
          userAssignment: true,
        },
      });

      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: assignment.id,
          userId: ctx.session.user.id,
          description: input.dateActivity
            ? `Fixou na data ${moment(input.dateActivity).format("DD/MM/YYYY")}`
            : `Trocou do usuário ${actualTechnic.name} para o usuário ${newTechnic.name}`,
        },
      });

      return data;
    }),
  getSummary: protectedProcedure
    .input(
      z.object({
        dateActivity: z.string(),
        shopId: z.string(),
      }),
    )
    .query(async ({ input: { dateActivity, shopId }, ctx }) => {
      const data = await ctx.prisma.assignment.findMany({
        where: {
          dateActivity: new Date(dateActivity),
          shopId,
          status: "FINALIZED",
          deletedAt: {
            equals: null,
          },
        },
      });
      if (!data)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ná há atendimentos",
        });
      return data;
    }),
  changeService: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        serviceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { serviceId, id } }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id },
        include: { service: true },
      });
      if (!assignment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ná existe esse atendimento",
        });
      const service = await ctx.prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (!service)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ná existe esse tipo de serviço",
        });

      const data = await ctx.prisma.assignment.update({
        where: { id },
        data: { serviceId },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: assignment.id,
          userId: ctx.session.user.id,
          description: `Trocou o tipo de serviço ${assignment.service.name} para o tipo serviço ${service.name}`,
        },
      });
      return data;
    }),
  changeRegion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        regionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { regionId, id } }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: { id },
        include: { Region: true },
      });
      if (!assignment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ná existe esse atendimento",
        });
      const region = await ctx.prisma.region.findUnique({
        where: { id: regionId },
      });
      if (!region)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ná existe esse tipo de serviço",
        });

      const data = await ctx.prisma.assignment.update({
        where: { id },
        data: { regionId },
      });
      await ctx.prisma.historyAssignment.create({
        data: {
          assignmentId: assignment.id,
          userId: ctx.session.user.id,
          description: `Trocou a região ${assignment.Region?.name} para a região ${region.name}`,
        },
      });
      return data;
    }),

  getAssignment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        shopId: z.string().optional(),
        dateActivity: z.string(),
      }),
    )
    .query(async ({ ctx, input: { userId, shopId, dateActivity } }) => {
      const role = ctx.session.user.role;
      const assignments = await ctx.prisma.assignment.findMany({
        where: {
          userId,
          shopId,
          deletedAt: null,
          OR:
            role === "TECH"
              ? [
                {
                  status: "IN_PROGRESS",
                },
                {
                  status: "PENDING",
                },
              ]
              : [
                {
                  dateActivity: { lt: new Date(dateActivity) },
                  status: "PENDING",
                },
                {
                  dateActivity: new Date(dateActivity),
                },
              ],
        },
        include: {
          observation: { include: { userAction: true } },
          client: true,
          Region: true,
          HistoryAssignment: { include: { userAction: true } },
          service: true,
          shop: true,
          Chat: {
            select: {
              id: true,
              contactId: true,
            },
          }
        },
        orderBy: {
          position: "asc",
        },
      });

      return assignments;
    }),
});
