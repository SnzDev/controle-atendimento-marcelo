import { socket } from "..";



export const disconnected = (callback: () => void) => {
  socket.on("disconnected", callback);
}

export const off = () => {
  socket.off("disconnected");
}
