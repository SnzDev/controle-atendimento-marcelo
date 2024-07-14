import { prisma } from "@morpheus/db";
import { BotActionTypes } from "@morpheus/validators";
import { type Socket } from "socket.io";
import { z } from "zod";
import { BotActionPubSub } from "~/pub-sub";



export const disconnected = (socket: Socket): void => {
  socket.on("disconnected", async () => {

    console.log("disconnected")

    const instance = await prisma.whatsappInstance.findMany();

    if (!instance[0]) return;

    await prisma.whatsappInstance.update({
      where: {
        id: instance[0].id
      },
      data: {
        qrCode: null,
        status: 'DISCONNECTED',
        phone: null,
        instanceName: null,
        platform: null,
        profilePicUrl: null
      }
    });

    socket.broadcast.emit("disconnected");
    const botAction = new BotActionPubSub(
      socket,
      BotActionTypes.Disconnected,
    );
    botAction.pub();

  });
}