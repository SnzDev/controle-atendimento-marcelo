import { type Message } from "whatsapp-web.js"
import { type InstanceInfo } from "~/utils/instance";
import { socket } from "..";

type MessageCreateProps = Message & {
  toInfo: InstanceInfo;
  fromInfo: InstanceInfo;
  mimeType: string | undefined;
  fileKey: string | undefined;
}
export const messageCreate = (props: MessageCreateProps) => {
  socket.emit("message_create", props);
}