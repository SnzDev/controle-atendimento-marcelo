import { type WAState } from "whatsapp-web.js";
import { socket } from "..";


export const changeState = (state: WAState) => {
  socket.emit("change_state", state);
}


