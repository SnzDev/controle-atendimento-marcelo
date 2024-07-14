import { socket } from "..";

interface MessageData {
  phone: string;
  message: string;
}
export const messageSend = (data: MessageData) => {
  socket.emit("message-send", data);
};
