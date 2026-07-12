import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { colors } from "@/presentation/shared/styles/colors";

interface NoActiveTripCardProps {
  readonly onViewTrips: () => void;
}

function NoActiveTripCard({ onViewTrips }: NoActiveTripCardProps) {
  return (
    <View className="-mt-5 rounded-[28px] bg-white p-5 shadow-lg shadow-blue-100">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF3FF]">
        <MaterialIcons name="event-busy" size={28} color={colors.primaryGlow} />
      </View>
      <Text className="mt-5 font-bold text-[#051223] text-xl">Nenhuma viagem ativa</Text>
      <Text className="mt-2 text-[#5E6A7A] leading-5">
        Não existe uma viagem em andamento agora. Consulte as viagens previstas para o dia.
      </Text>
      <View className="mt-5">
        <SystemButton title="Consultar viagens" iconLeft="directions-bus" onPress={onViewTrips} />
      </View>
    </View>
  );
}

export { NoActiveTripCard };
