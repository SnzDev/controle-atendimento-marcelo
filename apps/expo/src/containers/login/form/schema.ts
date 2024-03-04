import { z } from "zod";

const schemaValidation = z.object({
  username: z
    .string()
    .min(3, { message: "Obrigatório" })
    .transform((field) => field.replace(/\D/g, "")),
  password: z
    .string()
    .min(6, { message: "Mínimo 6 caracteres" })
    .transform((field) => field.replace(/\D/g, "")),
  keepConnected: z.boolean(),
});

type FieldValues = z.infer<typeof schemaValidation>;

export { type FieldValues, schemaValidation };
