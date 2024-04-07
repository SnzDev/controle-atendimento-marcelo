import { type Socket } from "socket.io";

export const logout = (socket: Socket) => {
  socket.on("logout", () => {
    socket.broadcast.emit("logout");
  });
}