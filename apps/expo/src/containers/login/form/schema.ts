import { z } from "zod";


const schemaValidation = z.object({
  username: z.string().min(3, { message: "Obrigatório" }),
  password: z.string().min(6, { message: "mínimo 6 caracteres" }),
  keepConnected: z.boolean(),
});

type FieldValues = z.infer<typeof schemaValidation>;

export { type FieldValues, schemaValidation };