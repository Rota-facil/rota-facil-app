import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { colors } from "@/presentation/shared/styles/colors";

interface TripDetailsPlaceholderScreenProps {
  tripId: string;
  context: "student" | "driver";
}

function TripDetailsPlaceholderScreen({ tripId, context }: TripDetailsPlaceholderScreenProps) {
  const router = useRouter();
  const title = context === "driver" ? "Detalhes operacionais" : "Detalhes da viagem";
  const description =
    context === "driver"
      ? "Esta rota ja recebe o identificador da viagem e sera usada para o gerenciamento operacional."
      : "Esta rota ja recebe o identificador da viagem e sera usada para participacao e acompanhamento.";

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC] px-6 pt-4 pb-10" edges={["top"]}>
      <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
          <MaterialIcons name="route" size={26} color={colors.primaryGlow} />
        </View>

        <Text className="mt-5 font-bold text-2xl text-[#051223]">{title}</Text>
        <Text className="mt-2 text-[#5E6A7A] leading-5">{description}</Text>

        <View className="mt-5 rounded-2xl bg-[#F8FAFC] p-4">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">ID da viagem</Text>
          <Text className="mt-1 font-semibold text-sm text-[#051223]">{tripId}</Text>
        </View>

        <View className="mt-6">
          <SystemButton title="Voltar" onPress={() => router.back()} iconLeft="arrow-back" />
        </View>
      </View>
    </SafeAreaView>
  );
}

export { TripDetailsPlaceholderScreen };
