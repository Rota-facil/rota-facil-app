import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { getTripTimeLabel, type TripMapViewModel } from "@/hooks/tripMapModel";
import { colors } from "@/presentation/shared/styles/colors";

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

      <View className="mt-4 flex-row gap-3">
        <View className="min-w-0 flex-1 flex-row items-center rounded-2xl bg-[#F7FBFC] px-3 py-2.5">
          <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-[#EAF3FF]">
            <MaterialIcons name="schedule" size={18} color={colors.primaryGlow} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[10px] font-bold uppercase text-[#64748B]">Horário</Text>
            <Text className="mt-0.5 font-bold text-xs text-[#051223]" numberOfLines={1}>
              {getTripTimeLabel(trip)}
            </Text>
          </View>
        </View>

        <View className="min-w-0 flex-1 flex-row items-center rounded-2xl bg-[#F7FBFC] px-3 py-2.5">
          <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-[#FFF6E4]">
            <MaterialIcons name="directions-bus" size={18} color={colors.accentGlow} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[10px] font-bold uppercase text-[#64748B]">Ônibus</Text>
            <Text className="mt-0.5 font-bold text-xs text-[#051223]" numberOfLines={1}>
              {trip.bus.plate || "Sem placa"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export { TripMapHeader };
