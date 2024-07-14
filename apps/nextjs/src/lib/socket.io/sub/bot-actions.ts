import type { ActionBotSchema } from "@morpheus/validators";
import { actionBotSchema } from "@morpheus/validators";

import { socket } from "..";

export const botActions = (
  cb: (data: ActionBotSchema) => void,
) => {
  socket.on(`bot-action`, (data: ActionBotSchema) => {
    try {
      cb(actionBotSchema.parse(data));
    } catch (e) {
      console.error(e);
    }
  });
};
