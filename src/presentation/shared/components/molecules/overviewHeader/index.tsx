import { Text, TouchableOpacity, View } from "react-native";
import EasyRouteLogo from "../../atoms/logo";

interface OnboardingHeaderProps {
  onSkip: () => void;
  showSkip: boolean;
}

export function OnboardingHeader({ onSkip, showSkip }: OnboardingHeaderProps) {
  return (
    <View className="w-full flex-row items-center justify-between py-4">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <EasyRouteLogo />

        <View className="justify-center" style={{ marginTop: 1 }}>
          <Text className="text-[16px] font-bold text-slate-900">Rota Fácil</Text>

          <Text
            className="text-[10px] uppercase text-slate-500"
            style={{
              letterSpacing: 2,
              fontWeight: "500",
            }}
          >
            Transporte Escolar
          </Text>
        </View>
      </View>

      {showSkip && (
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} className="px-1 py-1">
          <Text className="text-sm font-semibold text-slate-500">Pular</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
