import { z } from "zod";

const joinTripSchema = z.object({
  boardPointId: z.string("Ponto obrigatório").min(1, "Selecione o ponto de embarque"),
  institutionId: z.string("Instituição obrigatória").min(1, "Selecione a instituição"),
});

type JoinTripFormSchema = z.infer<typeof joinTripSchema>;

export { type JoinTripFormSchema, joinTripSchema };
