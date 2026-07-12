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
};

export function GreetingCard({
  greeting,
  userName,
  organization,
  emoji = "👋",
  unreadNotifications,
  onPressNotification,
  notificationIcon = "notifications-none",
}: GreetingCardProps) {
  return (
    <View className="w-full rounded-b-[10px] overflow-hidden">
      <LinearGradient
        colors={[colors.primary, colors.primaryGlow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full rounded-b-[10px] px-6 py-8 flex-row items-center justify-between"
      >
        <View className="flex-1 pr-4">
          <Text className="text-blue-100 uppercase text-lg ">{greeting}</Text>

          <Text className="text-white text-3xl font-bold mt-2 uppercase">
            {userName} {emoji}
          </Text>

          <Text className="text-blue-100 text-lg mt-3">{organization}</Text>
        </View>

        <Pressable
          onPress={onPressNotification}
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: "#032E70" }}
        >
          <MaterialIcons name={notificationIcon} size={19} color={colors.secondary} />

          {!!unreadNotifications && unreadNotifications > 0 && (
            <View
              className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full items-center justify-center px-1"
              style={{ backgroundColor: colors.accent }}
            >
              <Text className="text-white text-xs font-bold">{unreadNotifications}</Text>
            </View>
          )}
        </Pressable>
      </LinearGradient>
    </View>
  );
}
