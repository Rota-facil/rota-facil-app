import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/presentation/shared/styles/colors";

type Props = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  variant?: "primary" | "accent";
  onPress?: () => void;
};

export function ActionCard({ title, subtitle, icon, variant = "primary", onPress }: Props) {
  const gradient =
    variant === "primary"
      ? ([colors.primary, colors.primaryGlow] as const)
      : ([colors.accent, colors.accentGlow] as const);

  return (
    <Pressable onPress={onPress} className="w-48 h-32 active:opacity-90">
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 rounded-3xl p-5 overflow-hidden justify-between"
      >
        <MaterialIcons name={icon} size={34} color={colors.secondary} />

        <View>
          <Text className="text-white text-[16px] font-semibold" numberOfLines={1}>
            {title}
          </Text>

          <Text className="text-white text-[10px] opacity-90" numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
