import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";


export const whatsappRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx, input }) => {
      return ctx.prisma.whatsappInstance.findMany();
    }),
  getStatus: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const instance = await ctx.prisma.whatsappInstance.findUnique({
        where: {
          id: input.id
        }
      });

      if (!instance)
        throw new TRPCError({ code: "NOT_FOUND", message: "Instance not found" })

      const status = await fetch(`${instance.url}/${instance.id}/status`, {
        method: "GET"
      });

      return status.json();
    }),
  logout: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const instance = await ctx.prisma.whatsappInstance.findUnique({
        where: {
          id: input.id
        }
      });
      if (!instance)
        throw new TRPCError({ code: "NOT_FOUND", message: "Instance not found" })

      await fetch(`${instance.url}/${instance.id}/logout`, {
        method: "post"
      });
    }
    ),
  restart: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const instance = await ctx.prisma.whatsappInstance.findUnique({
        where: {
          id: input.id
        }
      });
      if (!instance)
        throw new TRPCError({ code: "NOT_FOUND", message: "Instance not found" })

      await fetch(`${instance.url}/${instance.id}/restart`, {
        method: "post"
      });

      await ctx.prisma.whatsappInstance.update({
        where: {
          id: input.id
        },
        data: {
          status: "OFFLINE"
        }
      });
    }
    ),

  sendMessage: publicProcedure
    .input(z.object({ id: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const instance = await ctx.prisma.whatsappInstance.findUnique({
        where: {
          id: input.id
        }
      });
      if (!instance)
        throw new TRPCError({ code: "NOT_FOUND", message: "Instance not found" })

      await fetch(`${instance.url}/${instance.id}/sendMessage`, {
        method: "POST",
        body: JSON.stringify({ message: input.message })
      });
    }),

  getAllContacts: publicProcedure
    .query(async ({ ctx }) => {
      const contacts = await ctx.prisma.whatsappContact.findMany();
      return contacts;
    }),
});