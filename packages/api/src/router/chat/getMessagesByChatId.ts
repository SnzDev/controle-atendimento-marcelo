import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { client, bucketName } from "../../lib/minio/client"
export const getMessagesByChatId = protectedProcedure.input(z.object({
  chatId: z.string(),

})).query(async ({ ctx, input }) => {

  const data = await ctx.prisma.whatsappMessages.findMany({
    where: {
      chatId: input.chatId,
    },
  });


  // Gerar URLs públicos para as chaves de arquivos
  const messagesWithUrls = await Promise.all(data.map(async (message) => {
    let fileUrl: string | null = null;
    if (message.fileKey)
      fileUrl = await client.presignedGetObject(bucketName, message.fileKey);
    return { ...message, fileUrl }
  }));

  return messagesWithUrls;
})