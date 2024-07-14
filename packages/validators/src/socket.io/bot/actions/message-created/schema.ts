import { z } from "zod";

import { BotActionTypes } from "../constants";
import { defaultSchemaBot, typeMessageSchema } from "../shared";

export const messageCreatedPayloadSchema = z.object({
  message: z.object({
    id: z.object({
      id: z.string(),
    }),
    ack: z.number(),
    body: z.string(),
    timestamp: z.number(),
    fromMe: z.boolean(),
    vCards: z.union([z.string(), z.array(z.string())]).optional(),
    location: z
      .object({
        latitude: z.string(),
        longitude: z.string(),
        description: z.string().optional(),
      })
      .optional(),
    type: typeMessageSchema,
    fileKey: z.string().optional(),
    mimeType: z.string().optional(),
    isGif: z.boolean().optional(),
  }),
  toInfo: z.object({
    platform: z.string(),
    pushname: z.string(),
    phone: z.string(),
    profilePicUrl: z.string().optional(),
  }),
  fromInfo: z.object({
    platform: z.string(),
    pushname: z.string(),
    phone: z.string(),
    profilePicUrl: z.string().optional(),
  }),
});

export const messageCreatedSchema = defaultSchemaBot.merge(
  z.object({
    action: z.enum([BotActionTypes.MessageCreated]),
    payload: messageCreatedPayloadSchema,
  }),
);
