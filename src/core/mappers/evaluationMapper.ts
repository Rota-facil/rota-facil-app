import type { EvaluationEntity } from "@/core/entity/evaluationEntity";
import type { EvaluateUserResponseDTO } from "@/http/dto/evaluationDTO";

const evaluationMapper = {
  toEntity(dto: EvaluateUserResponseDTO): EvaluationEntity {
    return {
      senderEmail: dto.senderEmail,
      receiverEmail: dto.receiverEmail,
      note: dto.note,
      feedback: dto.feedback,
      createdAt: dto.createdAt,
    };
  },
};

export { evaluationMapper };
