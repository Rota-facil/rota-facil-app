import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

interface MapOverlayButtonProps {
  readonly iconName: ComponentProps<typeof MaterialIcons>["name"];
  readonly label: string;
  readonly disabled?: boolean;
  readonly onPress: () => void;
}

function MapOverlayButton({ iconName, label, disabled, onPress }: MapOverlayButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm shadow-blue-100"
    >
      <MaterialIcons
        name={iconName}
        size={22}
        color={disabled ? colors.muted : colors.primaryGlow}
      />
    </Pressable>
  );
}

export { MapOverlayButton };
