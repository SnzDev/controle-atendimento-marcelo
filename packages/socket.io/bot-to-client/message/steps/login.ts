import { getClientInfoCpf, mkGetToken } from "@acme/mk";
import { prisma } from "@acme/db";
import { type Socket } from "socket.io";
import { delay } from "~/bot-to-client/utils/delay";
import { Retry, getVariablesFromChat, updateStep } from "~/bot-to-client/utils/chat";



type SendStepStartLoginProps = {
  chatId: string;
  phone: string;
  socket: Socket;
}

export const sendStepStartLogin = async ({ chatId, phone, socket }: SendStepStartLoginProps) => {
  const message = `Olá, 👋 eu sou o assistente virtual da Acessenet Telecom, é muito bom ter você aqui. 😊 Para começar, preciso que você digite seu cpf cadastrado no sistema. 🔢`;
  socket.emit("message-send", { message, phone });

  await updateStep(chatId, 'LOGIN');

}
type SendStepLoginProps = {
  chatId: string;
  phone: string;
  body: string;
  socket: Socket;
}
export const sendStepLogin = async ({ chatId, phone, body, socket }: SendStepLoginProps) => {

  const cpf = body.replace(/\D/g, '');
  const token = await mkGetToken();
  const client = await getClientInfoCpf({
    cpfCnpj: cpf,
    token: token.personCode
  });
  await delay(2000);
  if (!client?.Nome) return socket.emit("message-send", {
    message: `CPF não encontrado. 😞 Por favor, digite novamente. 🔄`,
    phone: phone,
  });


  let messageOk = `Tudo certo *Sr(a). ${client.Nome}* 😊, Estamos iniciando seu atendimento.`;

  messageOk += `\n\nComo posso te ajudar?\n*[1]* - Suporte técnico 🛠️\n*[2]* - Financeiro 💰\n`;

  socket.emit("message-send", {
    message: messageOk,
    phone: phone,
  });

  const variables = await getVariablesFromChat(chatId);

  await prisma.$transaction(async (tx) => {
    let clientMorpheus = await tx.client.findFirst({
      where: {
        cpf: cpf
      }
    });

    if (!clientMorpheus) {
      clientMorpheus = await tx.client.create({
        data: {
          name: client.Nome,
          cpf: cpf,
          externalId: client.CodigoPessoa.toString(),
          phone: phone,
        }
      });
    }


    await tx.whatsappChat.update({
      where: {
        id: chatId
      },
      data: {
        clientId: clientMorpheus.id,
        step: 'MENU_AFTER_LOGIN',
        variables: {
          ...variables,
          cpf: cpf,
          clientMk: client,
        }
      }
    });
  });

}

type SendStepMenuAfterLoginProps = {
  chatId: string;
  phone: string;
  body: string;
  socket: Socket;
}

export const sendStepMenuAfterLogin = async (props: SendStepMenuAfterLoginProps) => {
  const response = props.body.replace(/\D/g, '');
  await delay(2000);

  if (response === "1") {
    const message = `Sobre qual desses assuntos você deseja falar?\n*[1]* - Internet Lenta\n*[2]* - Internet Oscilando\n*[3]* - Sem Internet\n*[4]* - Outro Assunto\n`;
    props.socket.emit("message-send", { message, phone: props.phone });
    await updateStep(props.chatId, 'INTERNET_ISSUES');

  } else if (response === "2") {
    const message = `Sobre qual desses assuntos você deseja falar?\n*[1]* - 2ª via de boleto\n*[2]* - Outro Assunto`;
    props.socket.emit("message-send", { message, phone: props.phone });

    await updateStep(props.chatId, 'FINANCIAL_ISSUES');
  }
  else {
    let message = `Opção inválida, digite o número da opção que você deseja 🔢`;
    message += `\n\nComo posso te ajudar?\n*[1]* - Suporte técnico 🛠️\n*[2]* - Financeiro 💰\n`;
    await Retry({ ...props, onRetry: () => props.socket.emit("message-send", { message, phone: props.phone }) })
  }

}

