import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/presentation/shared/styles/colors";

type NotificationCardProps = {
  title: string;
  description: string;
  time?: string;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  onPress?: () => void;
};

export function NotificationCard({
  title,
  description,
  time,
  icon = "notifications-none",
  onPress,
}: NotificationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row items-center gap-3 rounded-[20px] p-3 shadow-lg"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "#E5EAF0" }}
      >
        <MaterialIcons name={icon} size={20} color={colors.primaryGlow} />
      </View>

      <View className="flex-1">
        <Text
          className="font-semibold text-base"
          style={{ color: colors.textDefault }}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          className="mt-0.5 font-medium text-xs"
          style={{ color: colors.textSecondary }}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>

      {time ? (
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          {time}
        </Text>
      ) : null}
    </Pressable>
  );
}
