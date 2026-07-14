import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { NotificationEntity, NotificationType } from "@/core/entity/notificationEntity";
import { colors } from "@/presentation/shared/styles/colors";

interface HomeNotificationsProps {
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly notifications: NotificationEntity[];
  readonly onViewAll: () => void;
}

const notificationIcons: Record<
  NotificationType,
  React.ComponentProps<typeof MaterialIcons>["name"]
> = {
  TRIP_STARTED: "location-on",
  TRIP_FINISHED: "check-circle-outline",
  TRIP_CANCELLED: "error-outline",
  STUDENT_CHECKIN: "how-to-reg",
};

const notificationVisuals: Record<
  NotificationType,
  {
    readonly accent: string;
    readonly background: string;
    readonly iconBackground: string;
    readonly label: string;
  }
> = {
  TRIP_STARTED: {
    accent: colors.primary,
    background: "#FFFFFF",
    iconBackground: "#EAF3FF",
    label: "Viagem iniciada",
  },
  TRIP_FINISHED: {
    accent: "#15803D",
    background: "#FFFFFF",
    iconBackground: "#ECFDF3",
    label: "Viagem finalizada",
  },
  TRIP_CANCELLED: {
    accent: "#B91C1C",
    background: "#FFFFFF",
    iconBackground: "#FFF1F2",
    label: "Viagem cancelada",
  },
  STUDENT_CHECKIN: {
    accent: "#B45309",
    background: "#FFFFFF",
    iconBackground: "#FFF7E8",
    label: "Check-in",
  },
};

function HomeNotifications({ error, isLoading, notifications, onViewAll }: HomeNotificationsProps) {
  return (
    <View className="mt-8">
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-[#051223] text-lg">Últimos avisos</Text>
          <Text className="mt-0.5 text-[#5E6A7A] text-xs">Atualizações da sua operação</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onViewAll}
          className="rounded-full bg-[#EAF3FF] px-3 py-2 active:opacity-85"
        >
          <Text className="font-bold text-[#0D6BEE] text-xs">Ver todos</Text>
        </Pressable>
      </View>

      {isLoading && notifications.length === 0 ? (
        <View className="items-center rounded-[24px] bg-white px-5 py-8 shadow-sm shadow-blue-100">
          <ActivityIndicator color={colors.primaryGlow} />
          <Text className="mt-3 text-[#5E6A7A] text-sm">Carregando avisos...</Text>
        </View>
      ) : error && notifications.length === 0 ? (
        <View className="flex-row items-start rounded-[24px] border border-red-100 bg-white p-4 shadow-sm shadow-blue-100">
          <MaterialIcons name="error-outline" size={22} color={colors.stateError} />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-[#051223]">Avisos indisponíveis</Text>
            <Text className="mt-1 text-[#5E6A7A] text-sm" numberOfLines={3}>
              {error}
            </Text>
          </View>
        </View>
      ) : notifications.length === 0 ? (
        <View className="items-center rounded-[24px] bg-white px-5 py-7 shadow-sm shadow-blue-100">
          <MaterialIcons name="notifications-none" size={28} color={colors.muted} />
          <Text className="mt-3 font-semibold text-[#051223]">Nenhum aviso recente</Text>
          <Text className="mt-1 text-center text-[#5E6A7A] text-sm">
            As atualizações sobre suas viagens aparecerão aqui.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {notifications.map((notification) => (
            <HomeNotificationItem key={notification.id} notification={notification} />
          ))}
        </View>
      )}
    </View>
  );
}

function HomeNotificationItem({ notification }: { readonly notification: NotificationEntity }) {
  const visual = notificationVisuals[notification.notificationType];

  return (
    <View
      className="overflow-hidden rounded-[24px] border p-4 shadow-sm shadow-blue-100"
      style={{
        backgroundColor: visual.background,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: visual.iconBackground }}
        >
          <MaterialIcons
            name={notificationIcons[notification.notificationType]}
            size={23}
            color={visual.accent}
          />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-bold text-[10px] uppercase" style={{ color: visual.accent }}>
              {visual.label}
            </Text>
            <Text className="font-semibold text-[#64748B] text-[10px] uppercase">
              {formatNotificationDate(notification.createdAt)}
            </Text>
          </View>

          <Text className="mt-1 font-bold text-[#051223] text-base leading-5">
            {notification.title}
          </Text>
          <Text className="mt-2 text-[#5E6A7A] text-sm leading-5">{notification.message}</Text>
        </View>
      </View>
    </View>
  );
}

function formatNotificationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}

export { HomeNotifications };
