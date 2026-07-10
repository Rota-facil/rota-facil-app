import { useCallback, useState } from "react";
import type {
  NotificationEntity,
  NotificationListParams,
  NotificationPageEntity,
} from "@/core/entity/notificationEntity";
import { NotificationService } from "@/core/service/notificationService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [notificationsPage, setNotificationsPage] = useState<NotificationPageEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (params?: NotificationListParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await NotificationService.getMyNotifications(params);
      setNotifications(data.content);
      setNotificationsPage(data.page);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível buscar as notificações."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setNotificationsPage(null);
    setError(null);
  }, []);

  return {
    notifications,
    notificationsPage,
    isLoading,
    error,
    loadNotifications,
    clearNotifications,
  };
}

export { useNotifications };
