import { type Message } from "whatsapp-web.js";
import { socket } from "..";

type MessageRevokeEveryoneData = {
  timestamp: number;
};

export const messageRevokeEveryone = (data: MessageRevokeEveryoneData) => {
  socket.emit("message_revoke_everyone", data);

}