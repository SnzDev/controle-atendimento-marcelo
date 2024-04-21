import { type Socket } from "socket.io";
import { Retry, startAttendance, updateStep } from "~/bot-to-client/utils/chat";
import { delay } from "~/bot-to-client/utils/delay";

type SendMenuProps = {
  chatId: string;
  phone: string;
  socket: Socket;
}
export const sendMenu = async (props: SendMenuProps) => {


  //create a delay to simulate the bot typing

  await delay(1000);
  let message = `Olá, 👋 eu sou o assistente virtual da Acessenet Telecom, é muito bom ter você aqui. 😊\nPara começar, digite o número da opção que você deseja 🔢`;
  message += `\n\n*[1]* - Já sou cliente 👤\n*[2]* - Aderir plano 📝`;
  props.socket.emit("message-send", { message, phone: props.phone });

  await updateStep(props.chatId, 'START_MENU');
}

type SendResponseMenuProps = {
  chatId: string;
  phone: string;
  socket: Socket;
  body: string;
}
export const sendResponseMenu = async (props: SendResponseMenuProps) => {
  await delay(2000);

  if (props.body === "1") {
    const message = `Por favor, digite seu CPF cadastrado no sistema 🔢`;
    props.socket.emit("message-send", { message, phone: props.phone });

    await updateStep(props.chatId, 'LOGIN')
  } else if (props.body === "2") {
    await startAttendance({ ...props, type: "CONTRATAÇÃO" });
  } else {
    let message = `Opção inválida, digite o número da opção que você deseja 🔢`;
    message += `\n\n*[1]* - Já sou cliente 👤\n*[2]* - Aderir plano 📝`;
    await Retry({ ...props, onRetry: () => props.socket.emit("message-send", { message, phone: props.phone }) })
  }
}