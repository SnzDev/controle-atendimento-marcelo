import { type Message, type MessageAck } from "whatsapp-web.js";
import { socket } from "..";


export const messageAck = (message: Message, ack: MessageAck) => {
  socket.emit("message_ack", { ...message, ack });

}