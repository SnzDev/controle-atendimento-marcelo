import { prisma } from "@morpheus/db";
import { type Socket } from "socket.io";
import { z } from "zod";



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

  });
}