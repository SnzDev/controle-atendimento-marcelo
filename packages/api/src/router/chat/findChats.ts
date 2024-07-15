import { protectedProcedure } from "../../trpc";



export const findChats = protectedProcedure.query(async ({ ctx, input }) => {
  const userWhatsapp = await ctx.prisma.user.findUnique({
    where: {
      userName: "whatsapp@morpheus.com.br",
    },
  });


  if (!userWhatsapp) return [];


  const chats = await ctx.prisma.assignment.findMany({
    where: {
      chatId: {
        not: null
      },
      OR: [
        {
          userId: ctx.session.user?.id,
        },
        { userId: userWhatsapp.id }
      ]
    },
    include: {
      Chat: true,
      service: true,
      client: true,
    }
  });
  if (!chats) return [];

  const lastMessages = await ctx.prisma.whatsappMessages.findMany({
    where: {
      chatId: {
        in: chats.filter(item => !!item.chatId).map(chat => chat.chatId ?? "")
      }
    }
  });

  const contacts = await ctx.prisma.whatsappContact.findMany({
    where: {
      id: {
        in: chats.filter(item => !!item?.Chat?.contactId).map(item => item?.Chat?.contactId ?? "")
      }
    }
  });


  return chats.filter(chat => !!chat.Chat).map((chat) => {
    const lastMessage = lastMessages?.find(item => item.chatId === chat.chatId ?? "")
    const unreadMessagesLenth = lastMessages?.filter(item => (item.chatId === chat.chatId ?? "") && !item.fromMe).filter(item => item.ack > 2).length
    const contact = contacts.find(item => item.id === chat.Chat?.contactId ?? "")
    chat.userId = chat.userId === userWhatsapp.id ? "" : chat.userId

    return {
      ...chat,
      contact,
      lastMessage,
      unreadMessagesLenth,
    };
  });


})