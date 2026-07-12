import { Text, View } from "react-native";
import { getTripTimeLabel, type TripMapViewModel } from "../../utils";
import { TripMapInfoTile } from "../TripMapInfoTile";

interface TripMapBottomSheetProps {
  readonly viewModel: TripMapViewModel;
}

function TripMapBottomSheet({ viewModel }: TripMapBottomSheetProps) {
  const { trip } = viewModel;

  return (
    <View className="rounded-[28px] bg-white/95 p-5 shadow-sm shadow-blue-100">
      <View className="items-center">
        <View className="h-1.5 w-12 rounded-full bg-[#D2DCE8]" />
      </View>

      <View className="mt-4 flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">
            {viewModel.routeFocus?.label ?? "Percurso"}
          </Text>
          <Text className="mt-1 font-bold text-xl text-[#051223]" numberOfLines={2}>
            {viewModel.routeFocus?.value ?? trip.route.name}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">
            {viewModel.selectionSource === "active" ? "Viagem vigente" : "Última acessada"}
          </Text>
          <Text className="mt-1 font-bold text-base text-[#0D6BEE]">
            {viewModel.hasBusLocation ? viewModel.statusStage.label : "Sem posição do ônibus"}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <TripMapInfoTile iconName="schedule" label="Horário" value={getTripTimeLabel(trip)} />
        <TripMapInfoTile iconName="groups" label="Alunos" value={String(trip.students)} />
        <TripMapInfoTile
          iconName="route"
          label="Progresso"
          value={viewModel.statusStage.stepLabel}
        />
      </View>

      <View className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E5EEF7]">
        <View
          className="h-full rounded-full bg-[#0D6BEE]"
          style={{ width: `${viewModel.statusStage.percentage}%` }}
        />
      </View>
    </View>
  );
}

export { TripMapBottomSheet };
