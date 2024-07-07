import { prisma } from "@morpheus/db";
import { type Socket } from "socket.io";
import { Retry, startAttendance, updateStep } from "~/bot-to-client/utils/chat";
import { delay } from "~/bot-to-client/utils/delay";

type SendStepInternetIssuesProps = {
  chatId: string;
  phone: string;
  body: string;
  socket: Socket;
}
export const sendStepInternetIssues = async (props: SendStepInternetIssuesProps) => {

  const response = props.body.replace(/\D/g, '');
  await delay(2000);

  if (response === "1")
    await startAttendance({ ...props, type: "INTERNET LENTA" });

  else if (response === "2")
    await startAttendance({ ...props, type: "INTERNET OSCILANDO" });

  else if (response === "3")
    await startAttendance({ ...props, type: "SEM INTERNET" });

  else if (response === "4") {
    await startAttendance({ ...props, type: "INTERNET OUTRO ASSUNTO" });
  } else {
    let message = `Opção inválida, digite o número da opção que você deseja 🔢`;
    message += `\nSobre qual desses assuntos você deseja falar?\n*[1]* - Internet Lenta\n*[2]* - Internet Oscilando\n*[3]* - Sem Internet\n*[4]* - Outro Assunto\n`;
    await Retry({ ...props, onRetry: () => props.socket.emit("message-send", { message, phone: props.phone }) })
  }
}
