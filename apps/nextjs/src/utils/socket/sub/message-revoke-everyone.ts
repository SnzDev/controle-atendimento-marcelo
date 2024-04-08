import { z } from "zod";
import { socket } from "..";


const messageRevokeSchema = z.object({
  timestamp: z.number()
})
type MessageRevokeData = z.infer<typeof messageRevokeSchema>;
export const messageRevokeEveryone = (callback: (data: MessageRevokeData) => void) => {
  socket.on("message_revoke_everyone", (data: MessageRevokeData) => {
    const parse = messageRevokeSchema.safeParse(callback);
    if (!parse.success) return console.error(parse.error.format());
    callback(data);
  });
}

export const messageRevokeEveryoneOff = () => {
  socket.off("message_revoke_everyone");
}
