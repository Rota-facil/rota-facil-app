type NotificationType = "TRIP_STARTED" | "TRIP_FINISHED" | "TRIP_CANCELLED" | "STUDENT_CHECKIN";

type Priority = "LOW" | "MEDIUM" | "HIGH";

type RecipientType = "STUDENT" | "DRIVER" | "PREFECTURE";

type TargetType = "TRIP" | "ROUTE" | "BUS";

interface NotificationEntity {
  readonly id: string;
  readonly recipientId: string;
  readonly targetId: string;
  readonly recipientType: RecipientType;
  readonly notificationType: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly targetType: TargetType;
  readonly priority: Priority;
  readonly createdAt: string;
}

interface NotificationPageEntity {
  readonly size: number;
  readonly number: number;
  readonly totalElements: number;
  readonly totalPages: number;
}

interface NotificationPageResultEntity {
  readonly content: NotificationEntity[];
  readonly page: NotificationPageEntity;
}

interface NotificationListParams {
  readonly page?: number;
  readonly size?: number;
}

export type {
  NotificationEntity,
  NotificationListParams,
  NotificationPageEntity,
  NotificationPageResultEntity,
  NotificationType,
  Priority,
  RecipientType,
  TargetType,
};
