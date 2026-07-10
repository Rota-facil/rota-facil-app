import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TripEntity, TripProgress, TripShift } from "@/core/entity/tripEntity";
import { colors } from "@/presentation/shared/styles/colors";

interface TripCardProps {
  trip: TripEntity;
  context: "student" | "driver";
  onPress: () => void;
}

const progressLabels: Record<TripProgress, string> = {
  NOT_STARTED: "Aguardando",
  CANCELLED: "Cancelada",
  STARTED: "Em andamento",
  STARTED_FINISHED: "Ida finalizada",
  RETURN_STARTED: "Retorno iniciado",
  RETURN_FINISHED: "Finalizada",
  INSTITUTION_ARRIVAL: "Na instituição",
  BOARD_POINT_ARRIVAL: "No ponto",
};

const shiftLabels: Record<TripShift, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  NIGHT: "Noite",
};

function getTripStatusLabel(trip: TripEntity): string {
  const lastStatus = trip.tripStatus.at(-1);

  if (lastStatus) {
    return progressLabels[lastStatus.progress];
  }

  return trip.actualStatus || "Status indisponível";
}

function getStatusColor(trip: TripEntity): { background: string; text: string; dot: string } {
  const lastStatus = trip.tripStatus.at(-1);

  if (lastStatus?.progress === "CANCELLED") {
    return {
      background: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500",
    };
  }

  if (lastStatus?.progress === "RETURN_FINISHED" || lastStatus?.progress === "STARTED_FINISHED") {
    return {
      background: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    };
  }

  return {
    background: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  };
}

function getPrimaryInstitutionName(trip: TripEntity): string {
  return trip.route.institutions[0]?.name ?? "Instituição não informada";
}

function getPrimaryBoardPointName(trip: TripEntity): string {
  return trip.route.boardPoints[0]?.name ?? "Ponto de embarque não informado";
}

function TripCard({ trip, context, onPress }: TripCardProps) {
  const statusColor = getStatusColor(trip);
  const driverLabel = context === "driver" ? "Responsável pela condução" : "Motorista";
  const routeSummary = `${trip.route.boardPoints.length} pontos · ${trip.route.institutions.length} instituições`;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#E2E8F0" }}
      className="rounded-[28px] border border-[#E5EAF0] bg-white p-4 shadow-sm shadow-blue-100 active:opacity-85"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">
            {shiftLabels[trip.route.shift]} · {trip.route.name}
          </Text>
          <Text className="mt-1 font-bold text-xl text-[#051223]">{trip.name}</Text>
        </View>

        <View className={`flex-row items-center rounded-full px-3 py-1 ${statusColor.background}`}>
          <View className={`mr-1.5 h-2 w-2 rounded-full ${statusColor.dot}`} />
          <Text className={`text-[11px] font-bold ${statusColor.text}`}>
            {getTripStatusLabel(trip)}
          </Text>
        </View>
      </View>

      <View className="mt-4 gap-3">
        <View className="flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF4DA]">
            <MaterialIcons name="place" size={21} color={colors.accentGlow} />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-[11px] font-bold uppercase text-[#64748B]">Rota principal</Text>
            <Text className="mt-0.5 font-semibold text-sm text-[#051223]">
              {getPrimaryBoardPointName(trip)}
            </Text>
            <Text className="mt-0.5 text-xs text-[#5E6A7A]">{getPrimaryInstitutionName(trip)}</Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <View className="min-h-[70px] flex-1 rounded-2xl bg-[#F8FAFC] p-3">
            <MaterialIcons name="schedule" size={18} color={colors.primaryGlow} />
            <Text className="mt-1 text-[10px] font-bold uppercase text-[#64748B]">Ida</Text>
            <Text className="mt-0.5 font-bold text-sm text-[#051223]">{trip.route.going}</Text>
          </View>

          <View className="min-h-[70px] flex-1 rounded-2xl bg-[#F8FAFC] p-3">
            <MaterialIcons name="keyboard-return" size={18} color={colors.primaryGlow} />
            <Text className="mt-1 text-[10px] font-bold uppercase text-[#64748B]">Retorno</Text>
            <Text className="mt-0.5 font-bold text-sm text-[#051223]">{trip.route.returning}</Text>
          </View>

          <View className="min-h-[70px] flex-1 rounded-2xl bg-[#F8FAFC] p-3">
            <MaterialIcons name="group" size={18} color={colors.primaryGlow} />
            <Text className="mt-1 text-[10px] font-bold uppercase text-[#64748B]">Alunos</Text>
            <Text className="mt-0.5 font-bold text-sm text-[#051223]">{trip.students}</Text>
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row items-center border-t border-[#E5EAF0] pt-4">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF]">
          <MaterialIcons name="directions-bus" size={23} color={colors.primaryGlow} />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">{driverLabel}</Text>
          <Text className="mt-0.5 font-bold text-sm text-[#051223]">{trip.bus.driver.name}</Text>
          <Text className="mt-0.5 text-xs text-[#5E6A7A]">
            Placa {trip.bus.plate} · {routeSummary}
          </Text>
        </View>

        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC]">
          <MaterialIcons name="chevron-right" size={24} color={colors.foreground} />
        </View>
      </View>
    </Pressable>
  );
}

export { TripCard };
