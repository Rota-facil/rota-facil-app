import { z } from "zod";

const googleCompleteRegistrationSchema = z.object({
  cpf: z
    .string("CPF obrigatório")
    .min(11, "Informe um CPF válido")
    .regex(/^\d{11}$/, "Informe apenas os 11 números do CPF"),
  prefectureId: z.string("Prefeitura obrigatória").min(1, "Selecione uma prefeitura"),
});

type GoogleCompleteRegistrationFormSchema = z.infer<typeof googleCompleteRegistrationSchema>;

export { type GoogleCompleteRegistrationFormSchema, googleCompleteRegistrationSchema };
