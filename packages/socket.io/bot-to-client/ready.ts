import { prisma } from "@morpheus/db";
import { type Socket } from "socket.io";
import { z } from "zod";

const QrSchema = z.object({
  platform: z.string(),
  pushname: z.string(),
  phone: z.string(),
  profilePicUrl: z.string(),
});

export const ready = (socket: Socket): void => {
  socket.on("ready", async (ready) => {

    const data = QrSchema.safeParse(ready);

    if (!data.success)
      return console.log({ ErrorParseSchema: data.error })

    socket.broadcast.emit("ready", data.data);

    const instance = await prisma.whatsappInstance.findMany();

    if (!instance[0]) return;

    await prisma.whatsappInstance.update({
      where: {
        id: instance[0].id
      },
      data: {
        qrCode: null,
        status: 'CONNECTED',
        phone: data.data.phone,
        instanceName: data.data.pushname,
        platform: data.data.platform,
        profilePicUrl: data.data.profilePicUrl
      }
    });

  });
}