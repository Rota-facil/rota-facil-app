interface EvaluateUserPayload {
  readonly feedback: string;
  readonly note: number;
}

interface EvaluationEntity {
  readonly senderEmail: string;
  readonly receiverEmail: string;
  readonly note: number;
  readonly feedback: string;
  readonly createdAt: string;
}

export type { EvaluateUserPayload, EvaluationEntity };
