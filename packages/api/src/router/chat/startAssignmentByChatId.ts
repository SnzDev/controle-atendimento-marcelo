import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const startAssignmentByChatId = protectedProcedure.input(z.object({
  chatId: z.string(),
})).mutation(async ({ ctx, input }) => {
  const chat = await ctx.prisma.assignment.findFirst({
    where: {
      chatId: input.chatId,
    },
  });

  if (!chat)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat não encontrado",
    })

  await ctx.prisma.assignment.update({
    where: {
      id: chat.id,
    },
    data: {
      userId: ctx.session.user?.id,
      status: "IN_PROGRESS"
    },
  });
})
