import { z } from "zod";

export const defaultSchemaBot = z.object({
});

export const typeMessageSchema = z.enum([
  "chat",
  "audio",
  "ptt",
  "image",
  "video",
  "document",
  "sticker",
  "location",
  "vcard",
  "multi_vcard",
  "revoked",
  "order",
  "product",
  "payment",
  "unknown",
  "groups_v4_invite",
  "list",
  "list_response",
  "buttons_response",
  "broadcast_notification",
  "call_log",
  "ciphertext",
  "debug",
  "e2e_notification",
  "gp2",
  "group_notification",
  "hsm",
  "interactive",
  "native_flow",
  "notification",
  "notification_template",
  "oversized",
  "protocol",
  "reaction",
  "template_button_reply",
  "poll_creation",
]);

export type TypeMessage = z.infer<typeof typeMessageSchema>;
