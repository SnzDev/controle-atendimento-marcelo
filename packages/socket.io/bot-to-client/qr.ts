import { prisma } from "@morpheus/db";
import { BotActionTypes } from "@morpheus/validators";
import { type Socket } from "socket.io";
import { z } from "zod";
import { BotActionPubSub } from "~/pub-sub";

const QrSchema = z.string();

export const qr = (socket: Socket): void => {
  socket.on("qr", async (qr) => {
    const data = QrSchema.safeParse(qr);


    if (!data.success)
      return console.log({ ErrorParseSchema: data.error })

    const botAction = new BotActionPubSub(
      socket,
      BotActionTypes.QR,
      { qr: data.data }
    );
    botAction.pub();

    const instance = await prisma.whatsappInstance.findMany();

    if (!instance[0]) return;

    await prisma.whatsappInstance.update({
      where: {
        id: instance[0].id
      },
      data: {
        qrCode: data.data,
        status: 'DISCONNECTED',
        phone: null,
        instanceName: null,
        platform: null,
        profilePicUrl: null
      }
    });
  });
}