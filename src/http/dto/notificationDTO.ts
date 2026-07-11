type NotificationTypeDTO = "TRIP_STARTED" | "TRIP_FINISHED" | "TRIP_CANCELLED" | "STUDENT_CHECKIN";

type PriorityDTO = "LOW" | "MEDIUM" | "HIGH";

type RecipientTypeDTO = "STUDENT" | "DRIVER" | "PREFECTURE";

type TargetTypeDTO = "TRIP" | "ROUTE" | "BUS";

interface NotificationResponseDTO {
  id: string;
  recipientId: string;
  targetId: string;
  recipientType: RecipientTypeDTO;
  notificationType: NotificationTypeDTO;
  title: string;
  message: string;
  targetType: TargetTypeDTO;
  priority: PriorityDTO;
  createdAt: string;
}

interface NotificationPageDTO {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface NotificationPageResponseDTO {
  content: NotificationResponseDTO[];
  page: NotificationPageDTO;
}

interface NotificationListParamsDTO {
  page?: number;
  size?: number;
}

export type {
  NotificationListParamsDTO,
  NotificationPageDTO,
  NotificationPageResponseDTO,
  NotificationResponseDTO,
  NotificationTypeDTO,
  PriorityDTO,
  RecipientTypeDTO,
  TargetTypeDTO,
};
