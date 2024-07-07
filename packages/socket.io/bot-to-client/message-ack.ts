import { prisma } from "@morpheus/db";
import { type Socket } from "socket.io";
enum MessageAck {
  ACK_ERROR = -1,
  ACK_PENDING = 0,
  ACK_SERVER = 1,
  ACK_DEVICE = 2,
  ACK_READ = 3,
  ACK_PLAYED = 4,
}
type MessageAckData = {
  protocol: string;
  ack: MessageAck;
};


export const messageAck = (socket: Socket) => {
  socket.on("message_ack", async (data: MessageAckData) => {
    socket.broadcast.emit("message_ack", data);

    const instance = await prisma.whatsappInstance.findMany();

    if (!instance || !data.protocol) return;

    const messageAcked = await prisma.whatsappMessages.findFirst({
      where: {
        protocol: data.protocol
      }
    })

    if (!messageAcked) return;

    await prisma.whatsappMessages.update({
      where: { id: messageAcked.id },
      data: {
        ack: data.ack,
      }
    })
  });
}