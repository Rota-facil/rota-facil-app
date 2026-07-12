import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TripEntity } from "@/core/entity/tripEntity";
import {
  formatTripTime,
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
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="-mt-5 rounded-[28px] bg-white p-5 shadow-lg shadow-blue-100 active:opacity-90"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">
            Viagem em andamento
          </Text>
          <Text className="mt-2 font-bold text-[#051223] text-xl" numberOfLines={2}>
            {trip.route.name || trip.name}
          </Text>
          {trip.name && trip.name !== trip.route.name ? (
            <Text className="mt-1 text-[#5E6A7A] text-sm" numberOfLines={2}>
              {trip.name}
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center rounded-full bg-emerald-100 px-3 py-2">
          <View className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
          <Text className="font-bold text-emerald-700 text-xs">{getTripStatusLabel(trip)}</Text>
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-[#EFF6FF] p-4">
          <MaterialIcons name="schedule" size={20} color={colors.primaryGlow} />
          <Text className="mt-2 text-[10px] font-bold uppercase text-[#64748B]">Horário</Text>
          <Text className="mt-1 font-bold text-[#051223]">{formatTripTime(trip.route.going)}</Text>
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
        <View className="ml-3 flex-1">
          <Text className="text-[10px] font-bold uppercase text-[#64748B]">{detailLabel}</Text>
          <Text className="mt-1 font-semibold text-[#051223]" numberOfLines={2}>
            {detailValue}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={25} color={colors.muted} />
      </View>
    </Pressable>
  );
}

export { HomeTripCard };
