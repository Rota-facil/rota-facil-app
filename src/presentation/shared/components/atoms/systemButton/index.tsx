import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { SYSTEM_BUTTON_VARIANTS } from "./variants";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

type SystemButtonVariant = "primary" | "white" | "danger" | "warning";

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
  variant?: SystemButtonVariant;
}

export function SystemButton({
  title,
  onPress,
  iconLeft,
  iconRight,
  iconColor,
  hideIcon = false,
  iconSize = 20,
  loading = false,
  disabled = false,
  variant = "primary",
}: SystemButtonProps) {
  const isDisabled = disabled || loading;

  const resolvedIconRight: MaterialIconName | undefined =
    !hideIcon && !iconLeft && !iconRight ? "chevron-right" : iconRight;

  const style = isDisabled ? SYSTEM_BUTTON_VARIANTS.disabled : SYSTEM_BUTTON_VARIANTS[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isDisabled}
      className="w-full"
    >
      <LinearGradient
        colors={[...style.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 24,
          shadowColor: style.shadow,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: isDisabled ? 0 : 0.25,
          shadowRadius: 16,
          elevation: isDisabled ? 0 : 8,
        }}
        className="h-14 flex-row items-center justify-center rounded-3xl px-6 gap-2"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            {iconLeft && (
              <MaterialIcons
                name={iconLeft}
                size={iconSize}
                color={iconColor ? iconColor : style.icon}
              />
            )}

            <Text className="font-semibold text-base" style={{ color: style.text }}>
              {title}
            </Text>

            {resolvedIconRight && (
              <MaterialIcons
                name={resolvedIconRight}
                size={iconSize}
                color={iconColor ? iconColor : style.icon}
              />
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
