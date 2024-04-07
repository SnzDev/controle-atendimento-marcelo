import { socket } from ".."


export const logout = () => {
  socket.emit("logout");
}