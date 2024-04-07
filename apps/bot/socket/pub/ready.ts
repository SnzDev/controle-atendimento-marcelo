import { socket } from "..";

type ReadyProps = {
  platform: string;
  pushname: string;
  phone: string;
  profilePicUrl: string;
}
export const ready = (
  props: ReadyProps
) => {
  socket.emit("ready", props);
}