import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const getMessagesByChatId = protectedProcedure.input(z.object({
  chatId: z.string(),

})).query(async ({ ctx, input }) => {

  const data = await ctx.prisma.whatsappMessages.findMany({
    where: {
      chatId: input.chatId,
    },
  });

  return data;
})