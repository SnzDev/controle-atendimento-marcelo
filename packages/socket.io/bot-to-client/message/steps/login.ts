import { getClientInfoCpf, mkGetToken } from "@acme/mk";
import { prisma } from "@acme/db";
import { type Socket } from "socket.io";

type SendStepLoginProps = {
  chatId: string;
  phone: string;
  cpf: string;
  socket: Socket;
}
export const sendStepLogin = async ({ chatId, phone, cpf, socket }: SendStepLoginProps) => {
  const token = await mkGetToken();
  const client = await getClientInfoCpf({
    cpfCnpj: cpf,
    token: token.personCode
  });

  if (!client?.Nome) return socket.emit("message-send", {
    message: `CPF não encontrado. Por favor, digite novamente.`,
    phone: phone,
  });


  const message = `Tudo certo *Sr(a). ${client.Nome}*, Estamos iniciando seu atendimento aguarde e em instantes um de nossos atendentes irá lhe atender.`;

  socket.emit("message-send", {
    message,
    phone: phone,
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
        contains: client.Nome
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
        externalId: client.CodigoPessoa.toString(),
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
      name: client.Nome,
      cpf: cpf,
      externalId: client.CodigoPessoa.toString(),
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