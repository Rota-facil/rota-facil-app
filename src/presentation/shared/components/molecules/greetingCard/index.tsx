import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/presentation/shared/styles/colors";

type GreetingCardProps = {
  greeting: string;
  userName: string;
  organization: string;
  emoji?: string;
  unreadNotifications?: number;
  onPressNotification?: () => void;
  notificationIcon?: React.ComponentProps<typeof MaterialIcons>["name"];
  summaryDescription?: string;
  summaryIcon?: React.ComponentProps<typeof MaterialIcons>["name"];
  summaryLabel?: string;
  summaryValue?: string;
};

export function GreetingCard({
  greeting,
  userName,
  organization,
  emoji,
  unreadNotifications,
  onPressNotification,
  notificationIcon = "notifications-none",
  summaryDescription,
  summaryIcon = "route",
  summaryLabel,
  summaryValue,
}: GreetingCardProps) {
  const hasSummary = Boolean(summaryLabel && summaryValue);

  return (
    <View className="w-full overflow-hidden rounded-b-[32px]">
      <LinearGradient
        colors={["#0B1F4D", colors.primary, colors.primaryGlow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full rounded-b-[32px] px-6 pb-8 pt-6"
      >
        <View className="flex-row items-start justify-between">
          <View className="min-w-0 flex-1 pr-4">
            <Text className="font-bold text-[11px] uppercase tracking-[1.2px] text-blue-100">
              {greeting}
            </Text>

            <Text className="mt-2 font-bold text-3xl text-white" numberOfLines={2}>
              {userName}
              {emoji ? ` ${emoji}` : ""}
            </Text>

            <View className="mt-4 self-start rounded-full bg-white/15 px-4 py-2">
              <Text className="font-semibold text-blue-50 text-xs" numberOfLines={1}>
                {organization}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir notificações"
            onPress={onPressNotification}
            className="h-12 w-12 items-center justify-center rounded-full bg-white/15 active:opacity-85"
          >
            <MaterialIcons name={notificationIcon} size={21} color="#FFFFFF" />

            {!!unreadNotifications && unreadNotifications > 0 && (
              <View
                className="-right-1 -top-1 absolute h-5 min-w-5 items-center justify-center rounded-full px-1"
                style={{ backgroundColor: colors.accent }}
              >
                <Text className="font-bold text-white text-xs">{unreadNotifications}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {hasSummary ? (
          <View className="mt-6 flex-row items-center rounded-[24px] bg-white/12 p-4">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <MaterialIcons name={summaryIcon} size={23} color="#FFFFFF" />
            </View>
            <View className="ml-3 min-w-0 flex-1">
              <Text className="font-bold text-[10px] uppercase tracking-[1px] text-blue-100">
                {summaryLabel}
              </Text>
              <Text className="mt-0.5 font-bold text-white" numberOfLines={1}>
                {summaryValue}
              </Text>
              {summaryDescription ? (
                <Text className="mt-0.5 text-blue-100 text-xs" numberOfLines={1}>
                  {summaryDescription}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        <View className="mt-7 flex-row gap-2">
          <View className="h-1.5 flex-1 rounded-full bg-white/70" />
          <View className="h-1.5 w-10 rounded-full bg-white/35" />
          <View className="h-1.5 w-5 rounded-full bg-white/25" />
        </View>
      </LinearGradient>
    </View>
  );
}
