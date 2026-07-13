import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import { HomeContextAction, ShortInfoPanel } from "./HomePrimitives";

function StudentNoTripContext({ onOpenTrips }: { readonly onOpenTrips: () => void }) {
  return (
    <View className="gap-5">
      <View className="rounded-[28px] bg-white p-5 shadow-lg shadow-blue-100">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
          <MaterialIcons name="directions-bus" size={26} color={colors.primaryGlow} />
        </View>
        <Text className="mt-5 font-bold text-[#051223] text-2xl">Sem viagem em andamento</Text>
        <Text className="mt-2 text-[#5E6A7A] leading-6">
          Você não possui uma viagem ativa ou vinculada neste momento.
        </Text>
        <View className="mt-5">
          <HomeContextAction
            accent={colors.primaryGlow}
            title="Ver minhas viagens"
            iconLeft="route"
            onPress={onOpenTrips}
          />
        </View>
      </View>

      <ShortInfoPanel
        title="Tudo tranquilo por aqui"
        accent={colors.primaryGlow}
        icon="check-circle"
        description="Quando uma viagem estiver disponível, ela aparecerá como contexto principal da Home."
      />
    </View>
  );
}

export { StudentNoTripContext };
