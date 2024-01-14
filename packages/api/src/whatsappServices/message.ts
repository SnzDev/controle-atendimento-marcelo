import { prisma } from "@acme/db";


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
      body: props.body,
      from: props.fromContactId,
      to: props.toContactId,
      fromMe: props.fromMe,
      timestamp: props.timestamp,
      chatId: props.chatId,
    }
  });

  return await prisma.whatsappMessages.create({
    data: {
      protocol: props.id.id,
      ack: props.ack,
      body: props.body,
      from: props.fromContactId,
      to: props.toContactId,
      fromMe: props.fromMe,
      timestamp: props.timestamp,
      chatId: props.chatId,
    }
  });
}