import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import { SystemButton } from "../../atoms/systemButton";

type TripsStateViewVariant = "loading" | "empty" | "error";

interface TripsStateViewProps {
  variant: TripsStateViewVariant;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

function TripsStateView({
  variant,
  title,
  description,
  actionLabel,
  onActionPress,
}: TripsStateViewProps) {
  const iconName = variant === "error" ? "error-outline" : "directions-bus";
  const iconColor = variant === "error" ? colors.stateError : colors.primaryGlow;
  const iconBackground = variant === "error" ? "bg-red-50" : "bg-blue-50";

  return (
    <View className="items-center rounded-[28px] bg-white px-5 py-8 shadow-sm shadow-blue-100">
      <View className={`h-14 w-14 items-center justify-center rounded-2xl ${iconBackground}`}>
        {variant === "loading" ? (
          <ActivityIndicator size="small" color={colors.primaryGlow} />
        ) : (
          <MaterialIcons name={iconName} size={28} color={iconColor} />
        )}
      </View>

      <Text className="mt-5 text-center font-bold text-xl text-[#051223]">{title}</Text>
      <Text className="mt-2 text-center text-[#5E6A7A] leading-5">{description}</Text>

      {actionLabel && onActionPress ? (
        <View className="mt-6 w-full">
          <SystemButton title={actionLabel} onPress={onActionPress} iconLeft="refresh" />
        </View>
      ) : null}
    </View>
  );
}

export { TripsStateView };
