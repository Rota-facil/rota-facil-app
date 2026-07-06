import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Image, Text, TouchableOpacity } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

interface GoogleButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GoogleButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: GoogleButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isDisabled}
      className="w-full"
    >
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 24,
          shadowColor: "#CBD5E1",
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
            <Image source={require("../../../../../../assets/images/google.png")} />
            <Text className="font-semibold text-base" style={{ color: colors.foreground }}>
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
