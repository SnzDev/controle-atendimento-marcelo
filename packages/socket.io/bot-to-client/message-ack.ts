import { prisma } from "@morpheus/db";
import { type ACK, BotActionTypes, TypeMessage } from "@morpheus/validators";
import { type Socket } from "socket.io";
import { BotActionPubSub } from "~/pub-sub";

type MessageAckData = {
  protocol: string;
  ack: ACK;
};


export const messageAck = (socket: Socket) => {
  socket.on("message_ack", async (data: MessageAckData) => {
    const botAction = new BotActionPubSub(
      socket,
      BotActionTypes.Ack,
      {
        ack: data.ack,
        protocol: data.protocol,
      },
    );
    botAction.pub();
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