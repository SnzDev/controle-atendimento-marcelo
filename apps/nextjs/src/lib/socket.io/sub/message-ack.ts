import { z } from "zod";

import { socket } from "..";

const messageAckSchema = z.object({
  protocol: z.string(),
  ack: z.number(),
  instanceId: z.string(),
});
type MessageAckData = z.infer<typeof messageAckSchema>;
export const messageAck = (
  instanceId: string,
  callback: (data: MessageAckData) => void,
) => {
  socket.on(`message_ack_${instanceId}`, (data: MessageAckData) => {
    const parse = messageAckSchema.safeParse(data);
    if (!parse.success) return console.error(parse.error.format());
    callback(data);
  });
};

export const messageAckOff = () => {
  socket.off("message_ack");
};
