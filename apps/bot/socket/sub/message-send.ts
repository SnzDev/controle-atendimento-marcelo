import { type Client } from "whatsapp-web.js";
import { socket } from ".."
import { getWid } from "~/utils/instance/getWid";
import { z } from "zod";

const messageSendSchema = z.object({
  phone: z.string(),
  message: z.string()
})

type MessageSendData = z.infer<typeof messageSendSchema>;
export const messageSend = (client: Client) => {
  socket.on('message-send', async (data: MessageSendData) => {

    const parse = messageSendSchema.safeParse(data);

    if (!parse.success) return console.log(parse.error.format());

    const { phone, message } = parse.data;

    const contact = await client.getNumberId(getWid(phone))
    if (!contact)
      return console.log('Contact not found');

    await client.sendMessage(contact._serialized, message);
  });
}