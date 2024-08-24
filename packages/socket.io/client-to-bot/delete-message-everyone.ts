import { type Socket } from "socket.io";

type MessageData = {
  protocol: string;
}

export const deleteMessageEveryone = (socket: Socket) => {
  socket.on("delete-message-everyone", (data: MessageData) => {
    socket.broadcast.emit("delete-message-everyone", data);
  });
}