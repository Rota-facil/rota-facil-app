import type {
  NotificationEntity,
  NotificationPageEntity,
  NotificationPageResultEntity,
} from "@/core/entity/notificationEntity";
import type {
  NotificationPageResponseDTO,
  NotificationResponseDTO,
} from "@/http/dto/notificationDTO";

const notificationMapper = {
  toEntity(dto: NotificationResponseDTO): NotificationEntity {
    return {
      id: dto.id,
      recipientId: dto.recipientId,
      targetId: dto.targetId,
      recipientType: dto.recipientType,
      notificationType: dto.notificationType,
      title: dto.title,
      message: dto.message,
      targetType: dto.targetType,
      priority: dto.priority,
      createdAt: dto.createdAt,
    };
  },

  toPageInfoEntity(dto: NotificationPageResponseDTO): NotificationPageEntity {
    return {
      size: dto.page.size,
      number: dto.page.number,
      totalElements: dto.page.totalElements,
      totalPages: dto.page.totalPages,
    };
  },

  toPageEntity(dto: NotificationPageResponseDTO): NotificationPageResultEntity {
    return {
      content: dto.content.map((notification) => this.toEntity(notification)),
      page: this.toPageInfoEntity(dto),
    };
  },
};

export { notificationMapper };
