import { socket } from "..";
export const logout = (callback: () => void) => {
  socket.on("logout", callback);
}