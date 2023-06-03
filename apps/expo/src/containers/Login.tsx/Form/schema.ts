import { z } from "zod";


const schemaValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type FieldValues = z.infer<typeof schemaValidation>;

export { type FieldValues, schemaValidation };