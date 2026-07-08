import { z } from "zod";

const studentProfileSchema = z.object({
  name: z.string("Nome obrigatório").min(3, "Informe seu nome completo"),
  email: z
    .string("E-mail obrigatório")
    .min(1, "E-mail obrigatório")
    .email({ message: "E-mail inválido" }),
  cpf: z
    .string("CPF obrigatório")
    .min(11, "Informe um CPF válido")
    .regex(/^\d{11}$/, "Informe apenas os 11 números do CPF"),
});

const studentPrefectureSchema = z.object({
  prefectureId: z.string("Prefeitura obrigatória").min(1, "Selecione uma prefeitura"),
});

type StudentProfileFormSchema = z.infer<typeof studentProfileSchema>;
type StudentPrefectureFormSchema = z.infer<typeof studentPrefectureSchema>;

export {
  type StudentPrefectureFormSchema,
  type StudentProfileFormSchema,
  studentPrefectureSchema,
  studentProfileSchema,
};
