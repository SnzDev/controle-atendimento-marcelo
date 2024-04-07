import { type WAState } from "whatsapp-web.js";
import { socket } from "..";


export const disconnected = (data: WAState | "NAVIGATION") => {
  socket.emit("disconnected", data);
}