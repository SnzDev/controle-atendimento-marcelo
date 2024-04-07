import { type Message } from "whatsapp-web.js"
import { type InstanceInfo } from "~/utils/instance";
import { socket } from "..";

type MessageProps = Message & {
  toInfo: InstanceInfo;
  fromInfo: InstanceInfo;
  mimeType: string | undefined;
  fileKey: string | undefined;
}
export const message = (props: MessageProps) => {
  socket.emit("message", props);
}