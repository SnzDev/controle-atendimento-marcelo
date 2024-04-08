import { type Message } from "whatsapp-web.js"
import { socket } from "..";
import { type InstanceInfo } from "~/utils/instance";

type MessageCreateProps = {
  message: Message;
  toInfo: InstanceInfo;
  fromInfo: InstanceInfo;
  mimeType: string | undefined;
  fileKey: string | undefined;
}
export const messageCreate = (props: MessageCreateProps) => {
  socket.emit("message_create", props);
}