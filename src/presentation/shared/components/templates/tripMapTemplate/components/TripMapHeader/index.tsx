import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import { getTripTimeLabel, type TripMapViewModel } from "../../utils";

interface TripMapHeaderProps {
  readonly viewModel: TripMapViewModel;
  readonly onRefresh: () => void;
}

function TripMapHeader({ viewModel, onRefresh }: TripMapHeaderProps) {
  const { trip } = viewModel;

  return (
    <View className="rounded-[28px] bg-white/95 p-4 shadow-sm shadow-blue-100">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#0D6BEE]">
          <MaterialIcons name="near-me" size={24} color="#FFFFFF" />
        </View>

        <View className="min-w-0 flex-1">
          <Text className="font-bold text-base text-[#051223]" numberOfLines={1}>
            {trip.name || trip.route.name}
          </Text>
          <Text className="mt-0.5 text-xs text-[#5E6A7A]" numberOfLines={1}>
            {getTripTimeLabel(trip)}
            {trip.bus.plate ? ` · ${trip.bus.plate}` : ""}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Atualizar acompanhamento"
          onPress={onRefresh}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#EAF3FF]"
        >
          <MaterialIcons name="refresh" size={20} color={colors.primaryGlow} />
        </Pressable>
      </View>

      <View className="mt-4 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">Motorista</Text>
          <Text className="mt-1 font-semibold text-sm text-[#051223]" numberOfLines={1}>
            {trip.bus.driver.name || "Não informado"}
          </Text>
        </View>

        <View className="flex-row items-center rounded-full bg-emerald-50 px-3 py-2">
          <View className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
          <Text className="font-bold text-xs text-emerald-700">{viewModel.statusLabel}</Text>
        </View>
      </View>
    </View>
  );
}

export { TripMapHeader };
