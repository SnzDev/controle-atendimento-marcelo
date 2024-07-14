import { z } from "zod";
import { protectedProcedure } from "../../trpc";




export const getContactByChatId = protectedProcedure.input(z.object({
  chatId: z.string(),

})).query(async ({ ctx, input }) => {

  const data = await ctx.prisma.whatsappMessages.findFirst({
    where: {
      chatId: input.chatId,
    },
    include: {
      fromContact: true,
    }
  });

  return data?.fromContact;

})