import { prisma } from "@acme/db";
import { getConnectionsWithContract, getInvoiceWithPdfAndBar, getPendingInvoices, mkGetToken } from "@acme/mk";
import { type Socket } from "socket.io";
import { Retry, getVariablesFromChat, startAttendance, updateStep } from "~/bot-to-client/utils/chat";
import { delay } from "~/bot-to-client/utils/delay";

type SendStepFinancialIssuesProps = {
  chatId: string;
  phone: string;
  body: string;
  socket: Socket;
}
export const sendStepFinancialIssues = async (props: SendStepFinancialIssuesProps) => {
  await delay(2000);
  if (props.body === "1") {

    const variables = await getVariablesFromChat(props.chatId);
    const token = await mkGetToken();
    const locations = await getConnectionsWithContract({ personCode: Number(variables.clientMk.CodigoPessoa), token: token.personCode });
    if (!locations) return;


    let message = `Escolha uma das opções abaixo 📄`;
    message += `\n\n*Escolha o ponto que deseja gerar a 2ª via do boleto:*`;
    locations.forEach((location, index) => {
      if (!location.contract) {
        message += `\n\n*[${index + 1}]* - Ponto sem contrato vinculado\n`;
        message += `${location.endereco}`;

      } else {
        message += `\n\n*[${index + 1}]* - ${location.contract?.codcontrato} - ${location.contract?.plano_acesso}\n`;
        message += `${location.endereco}`;
      }
    });

    props.socket.emit("message-send", { message, phone: props.phone });

    await prisma.whatsappChat.update({
      where: {
        id: props.chatId
      },
      data: {
        step: 'SECOND_VIA',
        variables: {
          ...variables,
          locations
        }
      }
    });
  }
  else if (props.body === "2") {
    await startAttendance({ ...props, type: "FINANCEIRO" });
  }
  else if (props.body === "3") {
    await updateStep(props.chatId, 'MENU_AFTER_LOGIN');
    let message = `Escolha uma das opções abaixo 📄`;
    message += `\n\n*[1]* - Suporte técnico 🛠️\n*[2]* - Financeiro 💰\n`;

    props.socket.emit("message-send", {
      message: message,
      phone: props.phone,
    });
  }
  else {
    let message = `Opção inválida, digite o número da opção que você deseja 🔢`;
    message += `\n*[1]* - 2ª via de boleto\n*[2]* - Outro Assunto\n*[3]* - Voltar`;
    await Retry({ ...props, onRetry: () => props.socket.emit("message-send", { message, phone: props.phone }) })
  }
}

type SendStepSecondViaProps = {
  chatId: string;
  phone: string;
  body: string;
  socket: Socket;
}
export const sendStepSecondVia = async (props: SendStepSecondViaProps) => {

  const response = props.body.replace(/\D/g, '');
  const variables = await getVariablesFromChat(props.chatId);
  if (!variables.locations) return;

  if (Number(response) > variables.locations.length) {
    let message = `Opção inválida, digite o número da opção que você deseja 🔢`;
    message += `\n\n*Escolha o ponto que deseja gerar a 2ª via do boleto:*`;
    variables.locations.forEach((location, index) => {
      if (!location.contract) {
        message += `\n\n*[${index + 1}]* - Ponto sem contrato vinculado\n`;
        message += `${location.endereco}`;

      } else {
        message += `\n\n*[${index + 1}]* - ${location.contract?.codcontrato} - ${location.contract?.plano_acesso}\n`;
        message += `${location.endereco}`;
      }
    });
    await Retry({ ...props, onRetry: () => props.socket.emit("message-send", { message, phone: props.phone }) })
  }

  const location = variables.locations[Number(response) - 1];

  const token = await mkGetToken();
  const invoices = await getPendingInvoices({ cd_cliente: variables.clientMk.CodigoPessoa, token: token.personCode });
  if (!invoices || !location?.contract || invoices.status !== "OK") {
    await updateStep(props.chatId, 'FINANCIAL_ISSUES');
    let message = `Não encontramos nenhuma fatura pendente`;
    message += `\n\nEscolha uma das opções abaixo 📄`;
    message += `\n*[1]* - 2ª via de boleto\n*[2]* - Outro Assunto\n*[3]* - Voltar`;
    await Retry({ ...props, onRetry: () => props.socket.emit("message-send", { message, phone: props.phone }) })

    return;
  }

  const invoice = invoices.FaturasPendentes.find((invoice) => invoice.contratos.includes(`Contrato: ${location.contract?.codcontrato}`));

  await delay(2000);

  if (!invoice) {
    await updateStep(props.chatId, 'FINANCIAL_ISSUES');
    let message = `Não encontramos nenhuma fatura pendente para o contrato ${location.contract?.codcontrato}`;
    message += `\n\nEscolha uma das opções abaixo 📄`;
    message += `\n*[1]* - 2ª via de boleto\n*[2]* - Outro Assunto\n`;
    await Retry({ ...props, onRetry: () => props.socket.emit("message-send", { message, phone: props.phone }) })

    return;
  }

  const pdf = await getInvoiceWithPdfAndBar({ cd_fatura: invoice.codfatura, token: token.personCode });
  const message = pdf?.barCode;
  props.socket.emit("message-send", { message, phone: props.phone, fileUrl: pdf?.PathDownload });


  await delay(2000);
  let newMessage = `*Plano de Acesso:* ${location.contract?.plano_acesso}`;
  newMessage += `\n*Endereço:* ${location.endereco}`;
  newMessage += `\n*Codigo de Barras:* ${pdf?.barCode}`;
  newMessage += `\n*Vencimento:* ${pdf?.Vcto}`;
  newMessage += `\n*Valor:* ${pdf?.Valor}`;
  newMessage += `\n\nQualquer dúvida, estamos à disposição.`;

  props.socket.emit("message-send", { message: newMessage, phone: props.phone });
  await updateStep(props.chatId, 'FINISHED');
}