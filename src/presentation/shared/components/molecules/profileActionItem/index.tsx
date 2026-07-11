import { MaterialIcons } from "@expo/vector-icons";
import type React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface ProfileActionItemProps {
  title: string;
  subtitle?: string;
  icon: MaterialIconName;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  trailingLabel?: string;
}

function ProfileActionItem({
  title,
  subtitle,
  icon,
  onPress,
  disabled = false,
  destructive = false,
  trailingLabel,
}: ProfileActionItemProps) {
  const iconColor = disabled ? colors.muted : destructive ? colors.stateError : colors.primaryGlow;
  const iconBackground = disabled ? "#E2E8F0" : destructive ? "#FEF2F2" : "#EAF3FF";
  const textColor = disabled ? colors.muted : destructive ? colors.stateError : colors.textDefault;
  const subtitleColor = disabled ? "#94A3B8" : colors.textSecondary;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className="min-h-16 flex-row items-center rounded-2xl border border-[#E5EAF0] bg-white px-4 py-3 active:opacity-80"
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBackground }}
      >
        <MaterialIcons name={icon} size={21} color={iconColor} />
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-base" style={{ color: textColor }} numberOfLines={1}>
          {title}
        </Text>

        {subtitle && (
          <Text className="mt-1 text-sm" style={{ color: subtitleColor }} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      {trailingLabel ? (
        <View className="ml-3 rounded-full bg-[#DCFCE7] px-3 py-1">
          <Text className="font-semibold text-[#16A34A] text-xs">{trailingLabel}</Text>
        </View>
      ) : (
        <MaterialIcons name="chevron-right" size={22} color={disabled ? "#94A3B8" : colors.muted} />
      )}
    </Pressable>
  );
}

export type { MaterialIconName };
export { ProfileActionItem };
