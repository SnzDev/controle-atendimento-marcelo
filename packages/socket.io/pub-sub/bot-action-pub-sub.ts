import { type Socket } from "socket.io";

import {
  type ActionBotPayload,
  type ActionBotSchema,
  actionBotSchema,
  type BotActionTypes,
} from "@morpheus/validators";

export class BotActionPubSub {
  action?: BotActionTypes;
  payload?: ActionBotPayload;
  socket: Socket;

  constructor(
    socket: Socket,
    action?: BotActionTypes,
    payload?: ActionBotPayload,
  ) {
    this.socket = socket;
    this.action = action;
    this.payload = payload;
  }

  public pub() {
    try {

      this.socket.broadcast.emit('bot-action',
        actionBotSchema.parse({
          action: this.action,
          payload: this.payload,
        }),

      );
    } catch (e) {
      console.error(e);
    }
  }

  public sub(cb: (data: ActionBotSchema) => void) {
    this.socket.on('bot-action', (data: ActionBotSchema) => {
      try {
        cb(actionBotSchema.parse(data));
      } catch (e) {
        console.error(e);
      }
    });
  }
}
