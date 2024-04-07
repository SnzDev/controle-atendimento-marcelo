import { socket } from "..";


export const authFailure = (msg: string) => {
  socket.emit("auth-failure", msg);
}