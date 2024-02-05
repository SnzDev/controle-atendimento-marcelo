import { prisma } from "@acme/db";
import { z } from "zod";


const typeMessageSchema = z.enum(['chat', 'revoked', 'image', 'video', 'audio', 'ptt', 'document', 'sticker', 'location', 'vcard', 'liveLocation', 'call']);


type TypeMessage = z.infer<typeof typeMessageSchema>;
interface CreateOrUpdateMessage {
  id: {
    id: string;
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
}

export const createOrUpdateMessage = async (props: CreateOrUpdateMessage) => {
  const message = await prisma.whatsappMessages.findFirst({
    where: {
      protocol: props.id.id
    }
  });

  if (message) return await prisma.whatsappMessages.update({
    where: { id: props.id.id },
    data: {
      protocol: props.id.id,
      ack: props.ack,
      body: ['chat', 'document'].includes(props.type) ? props.body : '',
      from: props.fromContactId,
      to: props.toContactId,
      fromMe: props.fromMe,
      timestamp: props.timestamp,
      chatId: props.chatId,
      fileKey: props.fileKey,
      mimetype: props.mimeType,
      isGif: props.isGif,
      location: props.location,
    }
  });

  return await prisma.whatsappMessages.create({
    data: {
      protocol: props.id.id,
      ack: props.ack,
      body: ['chat', 'document'].includes(props.type) ? props.body : '',
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
    }
  });
}