import { z } from "zod";

import { BotActionTypes } from "../constants";
import { defaultSchemaBot } from "../shared";

export const disconnectedPayloadShema = z.undefined();

export const disconnectedSchema = defaultSchemaBot.merge(
  z.object({
    action: z.enum([BotActionTypes.Disconnected]),
    payload: disconnectedPayloadShema,
  }),
);
