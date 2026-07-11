import type {
  NotificationListParamsDTO,
  NotificationPageResponseDTO,
} from "../dto/notificationDTO";
import { httpClient } from "../httpClient/httpClient";

const MY_NOTIFICATIONS_PATH = "/notifications/my";

function buildNotificationListPath(params?: NotificationListParamsDTO): string {
  if (!params) {
    return MY_NOTIFICATIONS_PATH;
  }

  const queryParams = [
    params.page === undefined ? null : `page=${encodeURIComponent(params.page)}`,
    params.size === undefined ? null : `size=${encodeURIComponent(params.size)}`,
  ].filter((param) => param !== null);

  if (queryParams.length === 0) {
    return MY_NOTIFICATIONS_PATH;
  }

  return `${MY_NOTIFICATIONS_PATH}?${queryParams.join("&")}`;
}

const NotificationRequest = {
  async getMyNotifications(
    accessToken: string,
    params?: NotificationListParamsDTO,
  ): Promise<NotificationPageResponseDTO> {
    return httpClient.get<NotificationPageResponseDTO>(buildNotificationListPath(params), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export { NotificationRequest };
