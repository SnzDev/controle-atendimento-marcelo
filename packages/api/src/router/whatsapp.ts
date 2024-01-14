import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sendMessageSync } from "../whatsappServices/api/sendMessage";


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
    .input(z.object({ instanceId: z.string().cuid(), contactId: z.string().cuid(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.prisma.whatsappContact.findUnique({
        where: {
          id: input.contactId
        }
      });

      if (!contact)
        throw new TRPCError({ code: "NOT_FOUND", message: "Contato não encontrado" })

      const instance = await ctx.prisma.whatsappInstance.findUnique({
        where: {
          id: input.instanceId
        }
      });


      if (!instance)
        throw new TRPCError({ code: "NOT_FOUND", message: "Instância não encontrada" })

      let userContact = instance.name;
      if (ctx.session?.user?.role !== "ADMIN") userContact = ctx.session?.user.name ?? instance.name;

      const data = await sendMessageSync({
        message: `*${userContact}:*\n${input.message}`,
        phone: contact.phone,
        url: instance.url
      });

      return data.json();
    }),

  getAllContacts: publicProcedure
    .query(async ({ ctx }) => {
      const contacts = await ctx.prisma.whatsappContact.findMany();
      return contacts;
    }),
  messagesFromContact: publicProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.whatsappMessages.findMany({
        where: {
          OR: [
            {
              from: input.contactId
            },
            {
              to: input.contactId
            }
          ]
        }
      });
      return messages;
    }),
});