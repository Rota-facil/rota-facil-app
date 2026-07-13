import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { NotificationEntity, NotificationType } from "@/core/entity/notificationEntity";
import { NotificationCard } from "@/presentation/shared/components/molecules/notificationCard";
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

function HomeNotifications({ error, isLoading, notifications, onViewAll }: HomeNotificationsProps) {
  return (
    <View className="mt-7">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-bold text-[#051223]">Últimos avisos</Text>
        <Pressable accessibilityRole="button" onPress={onViewAll} className="px-2 py-1">
          <Text className="font-bold text-[#0D6BEE] text-xs">Ver todos</Text>
        </Pressable>
      </View>

      {isLoading && notifications.length === 0 ? (
        <View className="items-center rounded-[24px] bg-white px-5 py-8">
          <ActivityIndicator color={colors.primaryGlow} />
          <Text className="mt-3 text-[#5E6A7A] text-sm">Carregando avisos...</Text>
        </View>
      ) : error && notifications.length === 0 ? (
        <View className="flex-row items-start rounded-[24px] border border-red-100 bg-white p-4">
          <MaterialIcons name="error-outline" size={22} color={colors.stateError} />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-[#051223]">Avisos indisponíveis</Text>
            <Text className="mt-1 text-[#5E6A7A] text-sm" numberOfLines={3}>
              {error}
            </Text>
          </View>
        </View>
      ) : notifications.length === 0 ? (
        <View className="items-center rounded-[24px] bg-white px-5 py-7">
          <MaterialIcons name="notifications-none" size={28} color={colors.muted} />
          <Text className="mt-3 font-semibold text-[#051223]">Nenhum aviso recente</Text>
          <Text className="mt-1 text-center text-[#5E6A7A] text-sm">
            As atualizações sobre suas viagens aparecerão aqui.
          </Text>
        </View>
      ) : (
        <View className="gap-2">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              title={notification.title}
              description={notification.message}
              icon={notificationIcons[notification.notificationType]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export { HomeNotifications };
