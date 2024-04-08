import { prisma } from "@acme/db";
import { type Socket } from "socket.io";

type SendStepStartProps = {
  chatId: string;
  phone: string;
  socket: Socket;
}
export const sendStepStart = async ({ chatId, phone, socket }: SendStepStartProps) => {

  const message = `Olá, eu sou o assistente virtual da Acessenet Telecom. Para começar, preciso que você digite seu cpf cadastrado no sistema. Por favor, digite seu CPF.`;

  socket.emit("message-send", { message, phone });

  await prisma.whatsappChat.update({
    where: {
      id: chatId
    },
    data: {
      step: 'LOGIN',
    }
  });
}