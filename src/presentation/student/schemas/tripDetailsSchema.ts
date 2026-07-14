import { z } from "zod";

const joinTripSchema = z.object({
  boardPointId: z.string("Ponto obrigatório").min(1, "Selecione o ponto de embarque"),
  institutionId: z.string("Instituição obrigatória").min(1, "Selecione a instituição"),
});

const evaluateTripDriverSchema = z.object({
  feedback: z.string().trim().max(600, "Informe no máximo 600 caracteres").optional(),
  note: z.number().min(1, "Selecione uma nota").max(5, "Selecione uma nota válida"),
});

type JoinTripFormSchema = z.infer<typeof joinTripSchema>;
type EvaluateTripDriverFormSchema = z.infer<typeof evaluateTripDriverSchema>;

export {
  type EvaluateTripDriverFormSchema,
  evaluateTripDriverSchema,
  type JoinTripFormSchema,
  joinTripSchema,
};
