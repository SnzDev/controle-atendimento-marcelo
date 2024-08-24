import { socket } from "..";

interface DeleteProps {
  protocol: string;
}
export const deleteMessageEveryone = (data: DeleteProps) => {
  socket.emit("delete-message-everyone", data);
};
