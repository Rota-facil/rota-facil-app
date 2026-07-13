import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/presentation/shared/styles/colors";

type ActionCardVariant = "primary" | "accent" | "success" | "neutral";

type Props = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  variant?: ActionCardVariant;
  onPress?: () => void;
};

const actionCardStyles: Record<
  ActionCardVariant,
  {
    readonly gradient: readonly [string, string];
    readonly iconBackground: string;
    readonly iconColor: string;
    readonly subtitleColor: string;
    readonly titleColor: string;
  }
> = {
  primary: {
    gradient: [colors.primary, colors.primaryGlow],
    iconBackground: "rgba(255,255,255,0.16)",
    iconColor: "#FFFFFF",
    subtitleColor: "#DBEAFE",
    titleColor: "#FFFFFF",
  },
  accent: {
    gradient: [colors.accent, colors.accentGlow],
    iconBackground: "rgba(255,255,255,0.22)",
    iconColor: "#FFFFFF",
    subtitleColor: "#FFF7ED",
    titleColor: "#FFFFFF",
  },
  success: {
    gradient: ["#0F9F6E", colors.stateSuccess],
    iconBackground: "rgba(255,255,255,0.18)",
    iconColor: "#FFFFFF",
    subtitleColor: "#DCFCE7",
    titleColor: "#FFFFFF",
  },
  neutral: {
    gradient: ["#FFFFFF", "#F8FAFC"],
    iconBackground: "#EAF3FF",
    iconColor: colors.primaryGlow,
    subtitleColor: colors.textSecondary,
    titleColor: colors.textDefault,
  },
};

export function ActionCard({ title, subtitle, icon, variant = "primary", onPress }: Props) {
  const style = actionCardStyles[variant];

  return (
    <Pressable onPress={onPress} className="h-32 w-full active:opacity-90">
      <LinearGradient
        colors={[...style.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-between overflow-hidden rounded-3xl p-5 shadow-sm shadow-blue-100"
      >
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: style.iconBackground }}
        >
          <MaterialIcons name={icon} size={25} color={style.iconColor} />
        </View>

        <View>
          <Text
            className="font-bold text-[16px]"
            numberOfLines={1}
            style={{ color: style.titleColor }}
          >
            {title}
          </Text>

          <Text className="mt-1 text-xs" numberOfLines={2} style={{ color: style.subtitleColor }}>
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
