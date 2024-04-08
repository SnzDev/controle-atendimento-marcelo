import { z } from "zod";
import { socket } from "..";

export const typeMessageSchema = z.enum(['chat', 'revoked', 'image', 'video', 'audio', 'ptt', 'document', 'sticker', 'location', 'vcard', 'liveLocation', 'call']);

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
export type MessageData = z.infer<typeof messageSchema>;

type Callback = (data: MessageData) => void;


export const messageRoom = (phone: string, callback: Callback) =>
  socket.on(`message-${phone}`, (data: MessageData) => {
    console.log(data)
    const parse = messageSchema.safeParse(data);

    if (!parse.success) return console.error(parse.error.format());

    callback(data);

  });



export const messageRoomOff = (phone: string) => {
  socket.off(`message-${phone}`);
}
