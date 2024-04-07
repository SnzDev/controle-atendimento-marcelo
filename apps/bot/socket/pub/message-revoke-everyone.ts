import { type Message } from "whatsapp-web.js";
import { socket } from "..";

export const messageRevokeEveryone = (message: Message) => {
  socket.emit("message_revoke_everyone", message);

}