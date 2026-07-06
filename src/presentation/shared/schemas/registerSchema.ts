import { z } from "zod";

export const registerSchema = z.object({
  name: z.string("Nome obrigatório").min(3, "Informe seu nome completo"),
  email: z
    .string("E-mail obrigatório")
    .min(1, "E-mail obrigatório")
    .email({ message: "E-mail inválido" }),
  cpf: z
    .string("CPF obrigatório")
    .min(11, "Informe um CPF válido")
    .regex(/^\d{11}$/, "Informe apenas os 11 números do CPF"),
  prefectureId: z.string("Prefeitura obrigatória").min(1, "Selecione uma prefeitura"),
  password: z
    .string("Senha obrigatória")
    .min(8, { error: "A senha deve possuir ao menos 8 caracteres" }),
});

export type RegisterFormSchema = z.infer<typeof registerSchema>;
