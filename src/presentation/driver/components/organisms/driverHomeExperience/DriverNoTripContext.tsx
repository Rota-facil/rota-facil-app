import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import { HomeContextAction, ShortInfoPanel } from "./HomePrimitives";

function DriverNoTripContext({ onOpenTrips }: { readonly onOpenTrips: () => void }) {
  return (
    <View className="gap-5">
      <View className="rounded-[28px] bg-white p-5 shadow-lg shadow-blue-100">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
          <MaterialIcons name="directions-bus" size={26} color={colors.primaryGlow} />
        </View>
        <Text className="mt-5 font-bold text-[#051223] text-2xl">Sem operação em andamento</Text>
        <Text className="mt-2 text-[#5E6A7A] leading-6">
          Nenhuma viagem operacional foi encontrada para este momento.
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
        title="Tudo certo por aqui"
        accent={colors.primaryGlow}
        icon="check-circle"
        description="Quando houver uma operação disponível, a Home destacará a ação principal."
      />
    </View>
  );
}

export { DriverNoTripContext };
