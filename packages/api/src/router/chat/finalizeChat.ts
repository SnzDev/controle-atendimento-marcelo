import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const finalizeChat = protectedProcedure.input(z.object({
  chatId: z.string(),
})).mutation(async ({ ctx, input }) => {
  const assignmentWithChat = await ctx.prisma.assignment.findFirst({
    where: {
      chatId: input.chatId,
    },
  });

  const chatId = input.chatId;
  if (!chatId || !assignmentWithChat)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat não encontrado",
    })

  await ctx.prisma.$transaction(async (tx) => {
    await tx.assignment.update({
      where: {
        id: assignmentWithChat.id,
      },
      data: {
        finalizedAt: new Date(),
        finalizedBy: ctx.session.user?.id,
        status: "FINALIZED"
      },
    });

    await tx.whatsappChat.update({
      where: {
        id: chatId,
      },
      data: {
        step: "FINISHED",
        updatedAt: new Date(),
      },
    });
  })

})
