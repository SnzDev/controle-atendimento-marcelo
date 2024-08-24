import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { sendMessageSync } from "../whatsappServices/api/sendMessage";

export const whatsappRouter = createTRPCRouter({
  getQrCode: protectedProcedure
    .query(async ({ ctx }) => {
      const instance = await ctx.prisma.whatsappInstance.findMany({
        select: {
          qrCode: true
        }
      });

      if (!instance[0])
        throw new TRPCError({ code: "NOT_FOUND", message: "Instance not found" })

      return instance[0].qrCode;
    }),

  getAll: protectedProcedure
    .query(({ ctx, input }) => {
      return ctx.prisma.whatsappInstance.findMany();
    }),
  getStatus: protectedProcedure
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
  logout: protectedProcedure
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
  restart: protectedProcedure
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
  sendMessage: protectedProcedure
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
  getAllContacts: protectedProcedure
    .query(async ({ ctx }) => {
      const contacts = await ctx.prisma.whatsappContact.findMany();
      return contacts;
    }),
  messagesFromContact: protectedProcedure
    .input(z.object({ contactId: z.string(), chatId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.whatsappMessages.findMany({
        where: {
          chatId: input.chatId,
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

      return messages.map(message => ({
        ...message,
        fileUrl: message.fileKey ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${message.fileKey}` : null
      }));

    }),
  getContactById: protectedProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {

    const contact = await ctx.prisma.whatsappContact.findUnique({
      where: {
        id: input.id
      }
    });

    return contact;
  }),

  getGroupChats: protectedProcedure.query(async ({ ctx }) => {
    const chats = await ctx.prisma.whatsappChat.findMany({
      where: {
        isGroup: true
      },
      include: {
        contact: true,
      }
    });

    const lastMessages = await ctx.prisma.whatsappMessages.findMany({
      where: {
        chatId: {
          in: chats.filter(item => !!item.id).map(chat => chat.id ?? "")
        }
      }
    });

    const contacts = await ctx.prisma.whatsappContact.findMany({
      where: {
        id: {
          in: chats.filter(item => !!item?.contactId).map(item => item?.contactId ?? "")
        }
      }
    });


    return chats.map((chat) => {
      const lastMessage = lastMessages?.find(item => item.chatId === chat.id ?? "")
      const unreadMessagesLenth = lastMessages?.filter(item => (item.chatId === chat.id ?? "") && !item.fromMe).filter(item => item.ack > 2).length
      const contact = contacts.find(item => item.id === chat?.contactId ?? "")

      return {
        ...chat,
        contact,
        lastMessage,
        unreadMessagesLenth,
      };

    })

  })
});

