import { z } from "zod";

import {
  messageAckPayloadSchema,
  messageAckSchema,
} from "./message-ack/schema";
import {
  messageCreatedPayloadSchema,
  messageCreatedSchema,
} from "./message-created/schema";
import {
  messageReceivedPayloadSchema,
  messageReceivedSchema,
} from "./message-received/schema";
import { disconnectedSchema, disconnectedPayloadShema } from "./disconnected/schema";
import { qrPayloadShema, qrSchema } from "./qr/schema";
import { messageGroupPayloadSchema, messageGroupSchema } from "./message-group/schema";

export const actionBotSchemas = [
  messageAckSchema,
  messageCreatedSchema,
  messageReceivedSchema,
  disconnectedSchema,
  qrSchema,
  messageGroupSchema
] as const;

export const actonPayloads = [
  messageAckPayloadSchema,
  messageCreatedPayloadSchema,
  messageReceivedPayloadSchema,
  disconnectedPayloadShema,
  qrPayloadShema,
  messageGroupPayloadSchema
] as const;

export const actionBotSchema = z.discriminatedUnion("action", [
  ...actionBotSchemas,
]);

export type ActionBotSchema = z.infer<typeof actionBotSchema>;

export const actionBotPayloadSchema = z.union(actonPayloads);

export type ActionBotPayload = z.infer<typeof actionBotPayloadSchema>;
