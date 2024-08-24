import { type Client } from "whatsapp-web.js";
import { z } from "zod";
import { socket } from "..";

const deleteMessageEveryoneSchema = z.object({
  protocol: z.string(),
})

type DeleteMessageEveryoneData = z.infer<typeof deleteMessageEveryoneSchema>;
export const deleteMessageEveryone = (client: Client) => {
  socket.on('delete-message-everyone', async (data: DeleteMessageEveryoneData) => {

    const parse = deleteMessageEveryoneSchema.safeParse(data);

    if (!parse.success) return console.log(parse.error.format());

    const { protocol } = parse.data;

    const message = await client.getMessageById(protocol);

    if (!message) return;
    try {
      await message.delete();
    }
    catch (e) {
      console.log(e);
    }

  });
}