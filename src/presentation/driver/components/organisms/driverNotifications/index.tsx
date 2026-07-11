import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, SectionList, Text, View } from "react-native";
import type { NotificationEntity, NotificationType } from "@/core/entity/notificationEntity";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCard } from "@/presentation/shared/components/molecules/notificationCard";
import { colors } from "@/presentation/shared/styles/colors";

interface NotificationSection {
  title: "RECENTES" | "ANTERIORES";
  data: NotificationEntity[];
}

const ONE_MINUTE_IN_MS = 60 * 1000;
const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;
const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;

const notificationIcons: Record<
  NotificationType,
  React.ComponentProps<typeof MaterialIcons>["name"]
> = {
  TRIP_STARTED: "location-on",
  TRIP_FINISHED: "check-circle-outline",
  TRIP_CANCELLED: "error-outline",
  STUDENT_CHECKIN: "how-to-reg",
};

function getElapsedTime(createdAt: string, now = Date.now()): number | null {
  const createdAtTimestamp = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtTimestamp)) {
    return null;
  }

  return Math.max(0, now - createdAtTimestamp);
}

function formatRelativeTime(createdAt: string, now = Date.now()): string | undefined {
  const elapsedTime = getElapsedTime(createdAt, now);

  if (elapsedTime === null) {
    return undefined;
  }

  if (elapsedTime < ONE_MINUTE_IN_MS) {
    return "agora";
  }

  if (elapsedTime < ONE_HOUR_IN_MS) {
    return `${Math.floor(elapsedTime / ONE_MINUTE_IN_MS)} min`;
  }

  if (elapsedTime < ONE_DAY_IN_MS) {
    return `${Math.floor(elapsedTime / ONE_HOUR_IN_MS)} h`;
  }

  const elapsedDays = Math.floor(elapsedTime / ONE_DAY_IN_MS);

  return elapsedDays === 1 ? "ontem" : `${elapsedDays} dias`;
}

function buildNotificationSections(
  notifications: NotificationEntity[],
  now = Date.now(),
): NotificationSection[] {
  const recent: NotificationEntity[] = [];
  const previous: NotificationEntity[] = [];

  for (const notification of notifications) {
    const elapsedTime = getElapsedTime(notification.createdAt, now);

    if (elapsedTime !== null && elapsedTime < ONE_DAY_IN_MS) {
      recent.push(notification);
    } else {
      previous.push(notification);
    }
  }

  return [
    {
      title: "RECENTES",
      data: recent,
    },
    {
      title: "ANTERIORES",
      data: previous,
    },
  ].filter((section) => section.data.length > 0) as NotificationSection[];
}

function DriverNotifications() {
  const { notifications, isLoading, error, loadNotifications } = useNotifications();
  const sections = buildNotificationSections(notifications);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  if (isLoading && notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 pb-24">
        <ActivityIndicator size="large" color={colors.primaryGlow} />

        <Text className="mt-4 text-center text-[#5E6A7A]">Carregando notificações...</Text>
      </View>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 pb-24">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2]">
          <MaterialIcons name="error-outline" size={28} color={colors.stateError} />
        </View>

        <Text className="mt-4 text-center font-bold text-[#051223] text-xl">
          Não foi possível carregar
        </Text>

        <Text className="mt-2 text-center text-[#5E6A7A]">{error}</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => loadNotifications()}
          className="mt-6 rounded-full bg-[#0D6BEE] px-6 py-3 active:opacity-85"
        >
          <Text className="font-semibold text-white">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8 pb-24">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#EAF3FF]">
          <MaterialIcons name="notifications-none" size={30} color={colors.primaryGlow} />
        </View>

        <Text className="mt-5 text-center font-bold text-[#051223] text-xl">
          Nenhuma notificação por aqui
        </Text>

        <Text className="mt-2 text-center text-[#5E6A7A] leading-5">
          As atualizações sobre suas viagens aparecerão nesta tela.
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      className="flex-1"
      sections={sections}
      keyExtractor={(notification) => notification.id}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 132,
        flexGrow: 1,
      }}
      renderSectionHeader={({ section }) => (
        <Text className="mb-3 mt-5 font-bold text-[#52657D] text-[11px] tracking-[1.2px]">
          {section.title}
        </Text>
      )}
      ItemSeparatorComponent={() => <View className="h-[10px]" />}
      renderSectionFooter={() => <View className="h-[6px]" />}
      renderItem={({ item }) => {
        return (
          <NotificationCard
            title={item.title}
            description={item.message}
            time={formatRelativeTime(item.createdAt)}
            icon={notificationIcons[item.notificationType]}
          />
        );
      }}
    />
  );
}

export { DriverNotifications };
