import { prisma } from "@morpheus/db";
import { type Socket } from "socket.io";

type MessageRevokeEveryoneData = {
  timestamp: number;
};


export const messageRevokeEveryone = (socket: Socket) => {

  socket.on("message_revoke_everyone", async (data: MessageRevokeEveryoneData) => {
    socket.broadcast.emit("message_revoke_everyone", data);

    const instance = await prisma.whatsappInstance.findMany();

    if (!instance || !data.timestamp) return;

    const message = await prisma.whatsappMessages.findFirst({
      where: {
        timestamp: data.timestamp
      }
    });

    if (!message) return;

    await prisma.whatsappMessages.update({
      where: { id: message.id },
      data: {
        isRevoked: true
      }
    })
  });
}