import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string("E-mail obrigatório")
    .min(1, "E-mail obrigatório")
    .email({ message: "E-mail inválido" }),
  password: z
    .string("Senha obrigatória")
    .min(8, { error: "A senha deve possuir ao menos 8 caracteres" }),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;
