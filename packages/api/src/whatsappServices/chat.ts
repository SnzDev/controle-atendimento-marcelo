

import { prisma } from '@acme/db';
import { sendMessageQueue } from './api/sendMessage';

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

  console.log({
    contactId,
    instanceId,
    hasChat
  })

  if (!hasChat) return await prisma.whatsappChat.create({
    data: {
      contactId,
      step: 'START',
      instanceId: instanceId,
    }
  });

  return hasChat;
}

type SendStepStartProps = {
  url: string;
  chatId: string;
  phone: string;
}
export const sendStepStart = async ({ chatId, phone, url }: SendStepStartProps) => {

  const phrase = `Olá, eu sou o assistente virtual da Acessenet Telecom. Para começar, preciso que você digite seu cpf cadastrado no sistema. Por favor, digite seu CPF.`;

  await sendMessageQueue({
    message: phrase,
    phone: phone,
    url: url
  });
  await prisma.whatsappChat.update({
    where: {
      id: chatId
    },
    data: {
      step: 'LOGIN',
    }
  });
}

type SendStepLoginProps = {
  url: string;
  chatId: string;
  phone: string;
  cpf: string;
  mk: {
    externalId: string;
    clientName: string;
    phone: string;
  }
}
export const sendStepLogin = async ({ chatId, url, cpf, mk: { clientName, phone, externalId } }: SendStepLoginProps) => {
  const phrase = `Tudo certo *Sr(a). ${clientName}*, Estamos iniciando seu atendimento aguarde e em instantes um de nossos atendentes irá lhe atender.`;

  await sendMessageQueue({
    message: phrase,
    phone: phone,
    url: url
  });

  await prisma.whatsappChat.update({
    where: {
      id: chatId
    },
    data: {
      step: 'ATENDANT',
    }
  });

  const existsClient = await prisma.client.findFirst({
    where: {
      name: {
        contains: clientName
      }
    }
  });
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
  const service = await prisma.service.findFirst({
    where: {
      name: { contains: "whatsApp" }
    }
  });

  const shop = await prisma.shop.findFirst({
    where: {
      name: { contains: "piripiri" }
    }
  });

  console.log({
    region,
    user,
    service,
    shop
  })
  if (!region || !user || !service || !shop) return;

  if (existsClient) {
    if (!existsClient.externalId || !existsClient.phone) await prisma.client.update({
      where: {
        id: existsClient.id
      },
      data: {
        externalId: externalId,
        phone: phone
      }
    });
    return await prisma.assignment.create({
      data: {
        position: 0,
        userId: user.id,
        serviceId: service.id,
        regionId: region.id,
        shopId: shop.id,
        status: "PENDING",
        dateActivity: new Date(),
        chatId: chatId,
        clientId: existsClient.id
      }
    });
  }

  return await prisma.client.create({
    data: {
      name: clientName,
      cpf: cpf,
      externalId: externalId,
      phone: phone,
      Assignment: {
        create: {
          position: 0,
          userId: user.id,
          serviceId: service.id,
          regionId: region.id,
          shopId: shop.id,
          status: "PENDING",
          dateActivity: new Date(),
          chatId: chatId,
        }
      }
    }
  });
}