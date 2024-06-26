import { type Message } from "whatsapp-web.js"
import { socket } from "..";
import { type InstanceInfo } from "~/utils/instance";

type MessageProps =
  {
    message: Message;
    toInfo: InstanceInfo;
    fromInfo: InstanceInfo;
    mimeType: string | undefined;
    fileKey: string | undefined;
  }
export const message = (props: MessageProps) => {
  socket.emit("message", props);
}