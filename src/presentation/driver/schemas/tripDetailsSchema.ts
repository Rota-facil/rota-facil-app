import { z } from "zod";

const cancelDriverTripSchema = z.object({
  reasonOfCancellation: z
    .string("Motivo obrigatório")
    .trim()
    .min(60, "Informe ao menos 60 caracteres")
    .max(600, "Informe no máximo 600 caracteres"),
});

const evaluateTripStudentSchema = z.object({
  feedback: z.string().trim().max(600, "Informe no máximo 600 caracteres").optional(),
  note: z.number().min(1, "Selecione uma nota").max(5, "Selecione uma nota válida"),
});

type CancelDriverTripFormSchema = z.infer<typeof cancelDriverTripSchema>;
type EvaluateTripStudentFormSchema = z.infer<typeof evaluateTripStudentSchema>;

export {
  type CancelDriverTripFormSchema,
  cancelDriverTripSchema,
  type EvaluateTripStudentFormSchema,
  evaluateTripStudentSchema,
};
