

import { prisma } from '@acme/db';
import { type ClientInfoResponse } from '@acme/mk/src/getClientInfoCpf';
import { type ConnectionWithContract } from '@acme/mk/src/getConnectionsWithContract';
import { type Socket } from 'socket.io';
const MAX_TRIES = 3;
interface HasChatProps {
  contactId: string;
  instanceId: string;
}
export const getHasChat = async ({ contactId, instanceId }: HasChatProps) => {

  const hasChat = await prisma.whatsappChat.findFirst({
    where: {
      contactId,
      NOT: {
        step: 'FINISHED',
      }
    }
  });

  if (!hasChat) return await prisma.whatsappChat.create({
    data: {
      contactId,
      step: 'START',
      instanceId: instanceId,
    }
  });

  return hasChat;
}

export const updateStep = async (chatId: string, step: string) =>
  await prisma.whatsappChat.update({
    where: {
      id: chatId
    },
    data: {
      step,
      tries: 0
    }
  });


type VariablesFromChatResponse = {
  clientMk: ClientInfoResponse;
  cpf: string;
  locations: Awaited<ConnectionWithContract>

}
export const getVariablesFromChat = async (chatId: string) => {
  const data = await prisma.whatsappChat.findFirst({
    select: {
      variables: true
    },
    where: {
      id: chatId
    }
  });

  return data?.variables as unknown as VariablesFromChatResponse ?? {};
}

type RetryProps = {
  chatId: string;
  socket: Socket;
  phone: string;
  onRetry?: () => void;
  onCanceled?: () => void;

}

export const Retry = async ({ chatId, phone, socket, onCanceled, onRetry }: RetryProps) => {

  const isCanceled = await prisma.$transaction(async (tx) => {
    const chat = await tx.whatsappChat.findFirst({
      where: {
        id: chatId
      }
    });

    if (!chat) return true;

    if (chat.tries >= MAX_TRIES) {
      await tx.whatsappChat.update({
        where: {
          id: chatId
        },
        data: {
          step: 'FINISHED',
          tries: 0
        }
      });

      return true;
    }

    await tx.whatsappChat.update({
      where: {
        id: chatId
      },
      data: {
        tries: {
          increment: 1
        }
      }
    });
    return false;
  });

  console.log({ isCanceled })
  if (isCanceled) {
    socket.emit("message-send", {
      message: `Desculpe, mas não conseguimos entender sua resposta.\nTente novamente mais tarde`,
      phone: phone,
    });

    if (onCanceled) onCanceled();


  } else {
    if (onRetry) onRetry();
  }

}


type SendStepMenuAfterLoginProps = {
  chatId: string;
  phone: string;
  body: string;
  socket: Socket;
  type: "INTERNET LENTA" | "INTERNET OSCILANDO" | "SEM INTERNET" | "INTERNET OUTRO ASSUNTO" | "FINANCEIRO" | "CONTRATAÇÃO"

}
export const startAttendance = async (props: SendStepMenuAfterLoginProps) => {
  let messageOk = `Estaremos encaminhando esse atendimento para o setor responsável. 🔄`;
  messageOk += `\nEm breve, um de nossos atendentes entrará em contato com você.`;
  messageOk += `\n\nMande mais detalhes sobre o seu problema, para que possamos te ajudar melhor.`;


  props.socket.emit("message-send", { message: messageOk, phone: props.phone });

  const region = await prisma.region.findFirst({
    where: {
      name: { contains: "piripiri" }
    }
  });
  const user = await prisma.user.findFirst({
    where: {
      name: { contains: 'whatsapp' }
    }
  });
  let service = await prisma.service.findFirst({
    where: {
      name: { contains: props.type }
    }
  });

  if (!service) service = await prisma.service.create({
    data: {
      name: props.type
    }
  });


  const shop = await prisma.shop.findFirst({
    where: {
      name: { contains: "piripiri" }
    }
  });
  const chat = await prisma.whatsappChat.findFirst({
    select: {
      clientId: true
    },
    where: {
      id: props.chatId
    }
  });
  if (!region || !user || !service || !shop || !chat?.clientId) return;

  await updateStep(props.chatId, 'ATTENDANCE');

  return await prisma.assignment.create({
    data: {
      position: 0,
      userId: user.id,
      serviceId: service.id,
      regionId: region.id,
      shopId: shop.id,
      status: "PENDING",
      dateActivity: new Date(),
      clientId: chat.clientId,
      chatId: props.chatId,
    }
  });
}

