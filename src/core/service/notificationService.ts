import type {
  NotificationListParams,
  NotificationPageResultEntity,
} from "@/core/entity/notificationEntity";
import { notificationMapper } from "@/core/mappers/notificationMapper";
import { NotificationRequest } from "@/http/request/notificationRequest";
import { getRequiredAccessToken } from "./sessionTokenService";

const NotificationService = {
  async getMyNotifications(params?: NotificationListParams): Promise<NotificationPageResultEntity> {
    const token = await getRequiredAccessToken();
    const dto = await NotificationRequest.getMyNotifications(token, params);

    return notificationMapper.toPageEntity(dto);
  },
};

export { NotificationService };
