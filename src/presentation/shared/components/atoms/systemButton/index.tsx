import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface SystemButtonProps {
  title: string;
  onPress: () => void;
  iconLeft?: MaterialIconName;
  iconRight?: MaterialIconName;
  hideIcon?: boolean;
  iconSize?: number;
  iconColor?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function SystemButton({
  title,
  onPress,
  iconLeft,
  iconRight,
  hideIcon = false,
  iconSize = 20,
  iconColor = "#FFFFFF",
  loading = false,
  disabled = false,
}: SystemButtonProps) {
  const isDisabled = disabled || loading;

  const resolvedIconRight: MaterialIconName | undefined =
    !hideIcon && !iconLeft && !iconRight ? "chevron-right" : iconRight;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isDisabled}
      className="w-full mt-6"
    >
      <LinearGradient
        colors={isDisabled ? ["#64748B", "#94A3B8"] : ["#1E3A8A", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 24,
          shadowColor: isDisabled ? "transparent" : "#2563EB",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: isDisabled ? 0 : 8,
        }}
        className="h-14 flex-row items-center justify-center rounded-3xl px-6 gap-2"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            {iconLeft && <MaterialIcons name={iconLeft} size={iconSize} color={iconColor} />}

            <Text className="text-white font-semibold text-base">{title}</Text>

            {resolvedIconRight && (
              <MaterialIcons name={resolvedIconRight} size={iconSize} color={iconColor} />
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
