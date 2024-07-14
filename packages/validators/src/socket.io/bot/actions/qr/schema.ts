import { z } from "zod";

import { BotActionTypes } from "../constants";
import { defaultSchemaBot } from "../shared";

export const qrPayloadShema = z.object({
  qr: z.string(),
});

export const qrSchema = defaultSchemaBot.merge(
  z.object({
    action: z.enum([BotActionTypes.QR]),
    payload: qrPayloadShema,
  }),
);
