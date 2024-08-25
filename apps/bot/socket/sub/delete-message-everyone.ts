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
    try {
      const message = await client.getMessageById(protocol);

      console.log({ message })
      if (!message) return;
      await message.delete(true);
    }
    catch (e) {
      console.log(e);
    }

  });
}