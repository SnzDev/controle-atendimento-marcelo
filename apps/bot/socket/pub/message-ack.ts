import { type Message, type MessageAck } from "whatsapp-web.js";
import { socket } from "..";

type MessageAckData = {
  protocol: string;
  ack: MessageAck;
};

export const messageAck = (data: MessageAckData) => {
  socket.emit("message_ack", data);

}