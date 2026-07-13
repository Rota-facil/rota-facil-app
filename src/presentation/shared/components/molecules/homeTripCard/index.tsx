import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TripEntity } from "@/core/entity/tripEntity";
import {
  formatTripTime,
  getPrimaryBoardPointName,
  getPrimaryInstitutionName,
  getTripShiftLabel,
  getTripStatusLabel,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import { colors } from "@/presentation/shared/styles/colors";

interface HomeTripCardProps {
  readonly detailLabel: string;
  readonly detailValue: string;
  readonly onPress: () => void;
  readonly trip: TripEntity;
}

function HomeTripCard({ detailLabel, detailValue, onPress, trip }: HomeTripCardProps) {
  const origin = getPrimaryBoardPointName(trip);
  const destination = getPrimaryInstitutionName(trip);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="-mt-6 overflow-hidden rounded-[28px] bg-white shadow-lg shadow-blue-100 active:opacity-90"
    >
      <View className="bg-[#0B1F4D] p-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="font-bold text-[11px] uppercase tracking-[1px] text-blue-100">
              Rota vinculada
            </Text>
            <Text className="mt-2 font-bold text-2xl text-white" numberOfLines={2}>
              {trip.route.name || trip.name}
            </Text>
            {trip.name && trip.name !== trip.route.name ? (
              <Text className="mt-1 text-blue-100 text-sm" numberOfLines={1}>
                {trip.name}
              </Text>
            ) : null}
          </View>

          <View className="flex-row items-center rounded-full bg-emerald-400/20 px-3 py-2">
            <View className="mr-2 h-2 w-2 rounded-full bg-emerald-300" />
            <Text className="font-bold text-emerald-50 text-xs">{getTripStatusLabel(trip)}</Text>
          </View>
        </View>

        <View className="mt-5 rounded-3xl bg-white/10 p-4">
          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F5A524]">
              <MaterialIcons name="trip-origin" size={18} color="#FFFFFF" />
            </View>
            <View className="ml-3 min-w-0 flex-1">
              <Text className="font-bold text-[10px] uppercase text-blue-100">Saída</Text>
              <Text className="mt-0.5 font-semibold text-white" numberOfLines={1}>
                {origin}
              </Text>
            </View>
          </View>

          <View className="ml-4 h-7 w-0.5 bg-white/35" />

          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6]">
              <MaterialIcons name="school" size={19} color="#FFFFFF" />
            </View>
            <View className="ml-3 min-w-0 flex-1">
              <Text className="font-bold text-[10px] uppercase text-blue-100">Destino</Text>
              <Text className="mt-0.5 font-semibold text-white" numberOfLines={1}>
                {destination}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="p-5">
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-[#EFF6FF] p-4">
            <MaterialIcons name="schedule" size={20} color={colors.primaryGlow} />
            <Text className="mt-2 text-[10px] font-bold uppercase text-[#64748B]">Horário</Text>
            <Text className="mt-1 font-bold text-[#051223]">
              {formatTripTime(trip.route.going)}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-[#FFF7E8] p-4">
            <MaterialIcons name="wb-sunny" size={20} color={colors.accentGlow} />
            <Text className="mt-2 text-[10px] font-bold uppercase text-[#64748B]">Turno</Text>
            <Text className="mt-1 font-bold text-[#051223]">
              {getTripShiftLabel(trip.route.shift)}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center border-[#E5EAF0] border-t pt-4">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF]">
            <MaterialIcons name="directions-bus" size={23} color={colors.primaryGlow} />
          </View>
          <View className="ml-3 min-w-0 flex-1">
            <Text className="font-bold text-[#64748B] text-[10px] uppercase">{detailLabel}</Text>
            <Text className="mt-1 font-semibold text-[#051223]" numberOfLines={2}>
              {detailValue}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={25} color={colors.muted} />
        </View>
      </View>
    </Pressable>
  );
}

export { HomeTripCard };
