interface EvaluateUserRequestDTO {
  feedback: string;
  note: number;
}

interface EvaluateUserResponseDTO {
  senderEmail: string;
  receiverEmail: string;
  note: number;
  feedback: string;
  createdAt: string;
}

export type { EvaluateUserRequestDTO, EvaluateUserResponseDTO };
