import { z } from "zod";

import { ACK, BotActionTypes } from "../constants";
import { defaultSchemaBot } from "../shared";

export const messageAckPayloadSchema = z.object({
  ack: z.nativeEnum(ACK),
  protocol: z.string(),
});

export const messageAckSchema = defaultSchemaBot.merge(
  z.object({
    action: z.enum([BotActionTypes.Ack]),
    payload: messageAckPayloadSchema,
  }),
);
