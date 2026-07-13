import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  View,
} from "react-native";
import type { NotificationEntity, NotificationType } from "@/core/entity/notificationEntity";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCard } from "@/presentation/shared/components/molecules/notificationCard";
import { colors } from "@/presentation/shared/styles/colors";
import { TAB_SCREEN_SCROLL_BOTTOM_PADDING } from "@/presentation/shared/styles/layout";

interface NotificationSection {
  title: "HOJE" | "ANTERIORES";
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

  const sections: NotificationSection[] = [];

  if (recent.length > 0) {
    sections.push({ title: "HOJE", data: recent });
  }

  if (previous.length > 0) {
    sections.push({ title: "ANTERIORES", data: previous });
  }

  return sections;
}

function formatNotificationCount(count: number): string {
  if (count === 0) {
    return "Nenhum aviso";
  }

  return count === 1 ? "1 aviso" : `${count} avisos`;
}

function StudentNotifications() {
  const { notifications, isLoading, error, loadNotifications } = useNotifications();
  const sections = buildNotificationSections(notifications);
  const handleRefresh = useCallback(() => {
    void loadNotifications();
  }, [loadNotifications]);
  const refreshControl = (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={handleRefresh}
      tintColor={colors.primaryGlow}
      colors={[colors.primaryGlow]}
    />
  );

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  return (
    <View className="flex-1">
      <View className="px-6 pb-3 pt-4">
        <Text className="font-bold text-2xl text-[#051223]">Avisos</Text>
        <Text className="mt-1 text-[#5E6A7A] text-sm">
          {formatNotificationCount(notifications.length)}
        </Text>
      </View>

      {isLoading && notifications.length === 0 ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: TAB_SCREEN_SCROLL_BOTTOM_PADDING,
            paddingHorizontal: 24,
          }}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <ActivityIndicator size="large" color={colors.primaryGlow} />
          <Text className="mt-4 text-center text-[#5E6A7A]">Carregando avisos...</Text>
        </ScrollView>
      ) : error && notifications.length === 0 ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: TAB_SCREEN_SCROLL_BOTTOM_PADDING,
            paddingHorizontal: 24,
          }}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2]">
            <MaterialIcons name="error-outline" size={28} color={colors.stateError} />
          </View>

          <Text className="mt-4 text-center font-bold text-[#051223] text-xl">
            Não foi possível carregar
          </Text>
          <Text className="mt-2 text-center text-[#5E6A7A]">{error}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleRefresh}
            className="mt-6 rounded-full bg-[#0D6BEE] px-6 py-3 active:opacity-85"
          >
            <Text className="font-semibold text-white">Tentar novamente</Text>
          </Pressable>
        </ScrollView>
      ) : notifications.length === 0 ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: TAB_SCREEN_SCROLL_BOTTOM_PADDING,
            paddingHorizontal: 32,
          }}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <View className="h-16 w-16 items-center justify-center rounded-full bg-[#EAF3FF]">
            <MaterialIcons name="notifications-none" size={30} color={colors.primaryGlow} />
          </View>

          <Text className="mt-5 text-center font-bold text-[#051223] text-xl">
            Nenhum aviso por aqui
          </Text>
          <Text className="mt-2 text-center text-[#5E6A7A] leading-5">
            As atualizações sobre suas viagens aparecerão nesta tela.
          </Text>
        </ScrollView>
      ) : (
        <SectionList
          className="flex-1"
          sections={sections}
          keyExtractor={(notification) => notification.id}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: TAB_SCREEN_SCROLL_BOTTOM_PADDING,
            flexGrow: 1,
          }}
          renderSectionHeader={({ section }) => (
            <Text className="mb-3 mt-4 font-bold text-[#52657D] text-[11px] tracking-[1.2px]">
              {section.title}
            </Text>
          )}
          ItemSeparatorComponent={() => <View className="h-[10px]" />}
          renderSectionFooter={() => <View className="h-[6px]" />}
          renderItem={({ item }) => (
            <NotificationCard
              title={item.title}
              description={item.message}
              time={formatRelativeTime(item.createdAt)}
              icon={notificationIcons[item.notificationType]}
            />
          )}
        />
      )}
    </View>
  );
}

export { StudentNotifications };
