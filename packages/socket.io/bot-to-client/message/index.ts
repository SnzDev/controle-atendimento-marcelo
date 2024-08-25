import { prisma } from "@morpheus/db";
import { BotActionTypes, typeMessageSchema } from "@morpheus/validators";
import { type Socket } from "socket.io";
import { z } from "zod";
import { BotActionPubSub } from "~/pub-sub";
import { getHasChat } from "../utils/chat";
import { createOrUpdateContact } from "../utils/contact";
import { createOrUpdateMessage } from "../utils/message";
import { sendStepFinancialIssues, sendStepSecondVia } from "./steps/financialIssues";
import { sendStepInternetIssues } from "./steps/internetIssues";
import { sendConnectionWithExpiredInvoice, sendStepLogin, sendStepMenuAfterLogin } from "./steps/login";
import { sendMenu, sendResponseMenu } from "./steps/menu";
const messageSchema = z.object({
  fileKey: z.string().optional(),
  mimeType: z.string().optional(),
  message: z.object({
    id: z.object({
      id: z.string(),
      _serialized: z.string()
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
    const botAction = new BotActionPubSub(
      socket,
      BotActionTypes.MessageReceived,
      {
        ...data,
        ack: data.message.ack,
        protocol: data.message.id.id,
      },
    );
    botAction.pub();

    const parse = messageSchema.safeParse(data);
    const instance = await prisma.whatsappInstance.findMany();

    if (!instance[0] || !parse.success) return;

    const fromInfo = await createOrUpdateContact(parse.data.fromInfo);
    const toInfo = await createOrUpdateContact(parse.data.toInfo);

    const hasChat = await getHasChat({ contactId: fromInfo.id, instanceId: instance[0].id, fromMe: parse.data.message.fromMe });
    if (!hasChat) return;
    console.log({ protocol: parse.data.message.id.id })
    await createOrUpdateMessage({
      id: {
        id: parse.data.message.id.id,
        serialized: parse.data.message.id._serialized,
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

    switch (hasChat.step) {
      case 'START':
        await sendMenu({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
        })
        break;
      case 'START_MENU':
        await sendResponseMenu({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
          body: parse.data.message.body,
        })
        break;
      case 'LOGIN':
        await sendStepLogin({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
          body: parse.data.message.body,
        })
        break;

      case 'MENU_AFTER_LOGIN':
        await sendStepMenuAfterLogin({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
          body: parse.data.message.body,
        })
        break;

      case 'INTERNET_ISSUES':
        await sendStepInternetIssues({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
          body: parse.data.message.body,
        })
        break;

      case 'FINANCIAL_ISSUES':
        await sendStepFinancialIssues({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
          body: parse.data.message.body,
        })
        break;

      case 'SECOND_VIA':
        await sendStepSecondVia({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
          body: parse.data.message.body,
        })
      case "CONNECTION_WITH_EXPIRED_INVOICE":
        await sendConnectionWithExpiredInvoice({
          socket,
          chatId: hasChat.id,
          phone: fromInfo.phone,
          body: parse.data.message.body,
        })
        break;
      default:
        break;
    }

    if (!parse.data.message.id.id) return;
  });

}