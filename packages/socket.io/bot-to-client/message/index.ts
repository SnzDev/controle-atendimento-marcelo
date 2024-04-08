import { prisma } from "@acme/db";
import { type Socket } from "socket.io";
import { z } from "zod";
import { getHasChat } from "../utils/chat";
import { createOrUpdateContact } from "../utils/contact";
import { createOrUpdateMessage, typeMessageSchema } from "../utils/message";
import { sendStepLogin } from "./steps/login";
import { sendStepStart } from "./steps/start";
const messageSchema = z.object({
  fileKey: z.string().optional(),
  mimeType: z.string().optional(),
  message: z.object({
    id: z.object({
      id: z.string()
    }),
    isGif: z.boolean().optional(),
    type: typeMessageSchema,
    vCards: z.array(z.string()).optional(),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      description: z.string().optional()
    }).optional(),
    ack: z.number(),
    body: z.string(),
    from: z.string(),
    to: z.string(),
    timestamp: z.number(),
    fromMe: z.boolean(),
  }),
  toInfo: z.object({
    pushname: z.string(),
    platform: z.string().optional(),
    profilePicUrl: z.string().optional(),
    phone: z.string()
  }),
  fromInfo: z.object({
    pushname: z.string(),
    platform: z.string().optional(),
    profilePicUrl: z.string().optional(),
    phone: z.string()
  }),
})
type MessageData = z.infer<typeof messageSchema>;
export const message = (socket: Socket) => {

  socket.on("message", async (data: MessageData) => {
    socket.broadcast.emit(`message-${data.fromInfo.phone}`, data);
    console.log(`message-${data.fromInfo.phone}`, data);
    const parse = messageSchema.safeParse(data);
    const instance = await prisma.whatsappInstance.findMany();

    if (!instance[0] || !parse.success) return;

    const fromInfo = await createOrUpdateContact(parse.data.fromInfo);
    const toInfo = await createOrUpdateContact(parse.data.toInfo);

    const hasChat = await getHasChat({ contactId: fromInfo.id, instanceId: instance[0].id })

    await createOrUpdateMessage({
      id: {
        id: parse.data.message.id.id
      },
      ack: parse.data.message.ack,
      body: parse.data.message.body,
      fromMe: parse.data.message.fromMe,
      timestamp: parse.data.message.timestamp,
      vCards: parse.data.message.vCards,
      location: parse.data.message.location,
      fileKey: parse.data.fileKey,
      type: parse.data.message.type,
      fromContactId: fromInfo.id,
      toContactId: toInfo.id,
      chatId: hasChat.id,
      mimeType: parse.data.mimeType,
      isGif: parse.data.message.isGif
    });

    if (hasChat.step === 'START')
      await sendStepStart({
        socket,
        chatId: hasChat.id,
        phone: fromInfo.phone,
      })

    if (hasChat.step === 'LOGIN') {
      await sendStepLogin({
        socket,
        chatId: hasChat.id,
        phone: fromInfo.phone,
        cpf: parse.data.message.body?.replace(/\D/g, ''),
      })
    }

    if (!parse.data.message.id.id) return;
  });

}