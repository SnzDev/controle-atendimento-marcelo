import { socket } from "..";


export const changeStatus = (status: string) => {
  socket.emit("change-status", status);
}