import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { getTripTimeLabel, type TripMapViewModel } from "@/hooks/tripMapModel";
import { colors } from "@/presentation/shared/styles/colors";
import { TripMapInfoTile } from "../TripMapInfoTile";

interface TripMapDetailsModalProps {
  readonly visible: boolean;
  readonly viewModel: TripMapViewModel;
  readonly onClose: () => void;
}

const selectionSourceLabels: Record<TripMapViewModel["selectionSource"], string> = {
  active: "Viagem vigente",
  linked: "Viagem vinculada",
  "last-accessed": "Última acessada",
};

function TripMapDetailsModal({ visible, viewModel, onClose }: TripMapDetailsModalProps) {
  const { trip } = viewModel;
  const directionLabel = viewModel.routeProgress.direction === "returning" ? "Volta" : "Ida";
  const pointProgressLabel =
    viewModel.routeProgress.progressTotalPoints === 0
      ? "Sem pontos de rota"
      : `${viewModel.routeProgress.completedPoints}/${viewModel.routeProgress.progressTotalPoints}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="rounded-t-[28px] bg-white px-5 pb-7 pt-4">
          <View className="items-center">
            <View className="h-1.5 w-12 rounded-full bg-[#D2DCE8]" />
          </View>

          <View className="mt-5 flex-row items-start justify-between gap-4">
            <View className="min-w-0 flex-1">
              <Text className="text-[11px] font-bold uppercase text-[#64748B]">
                {viewModel.routeFocus?.label ?? "Percurso"}
              </Text>
              <Text className="mt-1 font-bold text-xl text-[#051223]" numberOfLines={2}>
                {viewModel.routeFocus?.value ?? trip.route.name}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar detalhes da rota"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]"
            >
              <MaterialIcons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <View className="mt-4 rounded-2xl bg-[#F7FBFC] p-4">
            <Text className="text-[11px] font-bold uppercase text-[#64748B]">
              {selectionSourceLabels[viewModel.selectionSource]}
            </Text>
            <Text className="mt-1 font-bold text-base text-[#0D6BEE]">
              {viewModel.hasBusLocation ? viewModel.statusStage.label : "Sem posição do ônibus"}
            </Text>
          </View>

          <View className="mt-5 flex-row gap-3">
            <TripMapInfoTile iconName="schedule" label="Horário" value={getTripTimeLabel(trip)} />
            <TripMapInfoTile iconName="groups" label="Alunos" value={String(trip.students)} />
            <TripMapInfoTile
              iconName="route"
              label={directionLabel}
              value={`${viewModel.routeProgress.percentage}%`}
            />
          </View>

          <Text className="mt-3 text-xs font-semibold text-[#64748B]">
            Pontos passados: {pointProgressLabel}
          </Text>

          <View className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E5EEF7]">
            <View
              className="h-full rounded-full bg-[#0D6BEE]"
              style={{ width: `${viewModel.statusStage.percentage}%` }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export { TripMapDetailsModal };
