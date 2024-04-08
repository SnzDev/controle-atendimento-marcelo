import { type Socket } from "socket.io";

type MessageData = {
  phone: string;
  message: string;
}

export const messageSend = (socket: Socket) => {
  socket.on("message-send", (data: MessageData) => {
    socket.broadcast.emit("message-send", data);
  });
}