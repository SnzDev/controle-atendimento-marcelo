import { type ClientSession } from "whatsapp-web.js"
import { socket } from ".."

export const authenticated = (session?: ClientSession) => {
  socket.emit("authenticated", session)
}