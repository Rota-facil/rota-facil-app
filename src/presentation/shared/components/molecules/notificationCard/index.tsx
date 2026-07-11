import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/presentation/shared/styles/colors";

type NotificationCardProps = {
  title: string;
  description: string;
  time?: string;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  iconBackgroundColor?: string;
  iconColor?: string;
  onPress?: () => void;
};

export function NotificationCard({
  title,
  description,
  time,
  icon = "notifications-none",
  iconBackgroundColor = "#E5EAF0",
  iconColor = colors.primaryGlow,
  onPress,
}: NotificationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="w-full flex-row items-center rounded-[22px] px-4 py-[14px]"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        shadowColor: "#0B3C7A",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View
        className="h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: iconBackgroundColor,
        }}
      >
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>

      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between">
          <Text
            className="mr-3 flex-1 font-semibold text-[15px]"
            style={{
              color: colors.textDefault,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>

          {time ? (
            <Text
              className="shrink-0 text-[12px]"
              style={{
                color: colors.textSecondary,
              }}
            >
              {time}
            </Text>
          ) : null}
        </View>

        <Text
          className="mt-1 font-medium text-[12px] leading-[17px]"
          style={{
            color: colors.textSecondary,
          }}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
