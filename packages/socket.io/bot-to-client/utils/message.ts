import { prisma } from "@morpheus/db";
import { z } from "zod";


export const typeMessageSchema = z.enum(['chat', 'revoked', 'image', 'video', 'audio', 'ptt', 'document', 'sticker', 'location', 'vcard', 'liveLocation', 'call']);


type TypeMessage = z.infer<typeof typeMessageSchema>;
interface CreateOrUpdateMessage {
  id: {
    id: string;
    serialized: string;
  };
  ack: number;
  body: string;
  timestamp: number;
  fromMe: boolean;
  toContactId: string;
  fromContactId: string;
  chatId: string;
  vCards?: string | string[];
  location?: {
    latitude: number;
    longitude: number;
    description?: string;
  };
  type: TypeMessage;
  fileKey?: string;
  mimeType?: string;
  isGif?: boolean;
  author?: string;
}

export const createOrUpdateMessage = async (props: CreateOrUpdateMessage) => {
  if (!props.id.id) return;
  const message = await prisma.whatsappMessages.findFirst({
    where: {
      protocol: props.id.id
    }
  });
  const body = ['chat', 'document', 'image'].includes(props.type) ? props.body : '';


  if (message) return await prisma.whatsappMessages.update({
    where: { id: props.id.id },
    data: {
      serialized: props.id.serialized,
      protocol: props.id.id,
      ack: props.ack,
      body,
      from: props.fromContactId,
      to: props.toContactId,
      fromMe: props.fromMe,
      timestamp: props.timestamp,
      chatId: props.chatId,
      fileKey: props.fileKey,
      mimetype: props.mimeType,
      isGif: props.isGif,
      location: props.location,
      author: props.author,
    }
  });

  return await prisma.whatsappMessages.create({
    data: {
      serialized: props.id.serialized,
      protocol: props.id.id,
      ack: props.ack,
      body,
      type: props.type,
      vcard: props.vCards,
      location: props.location,
      from: props.fromContactId,
      to: props.toContactId,
      fromMe: props.fromMe,
      timestamp: props.timestamp,
      chatId: props.chatId,
      fileKey: props.fileKey,
      mimetype: props.mimeType,
      isGif: props.isGif,
      author: props.author,
    }
  });
}