import { socket } from "..";


export const qr = (qr: string) => {
  socket.emit("qr", qr);
}