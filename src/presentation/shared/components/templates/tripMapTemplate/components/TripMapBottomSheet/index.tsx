import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TripMapViewModel } from "@/hooks/tripMapModel";
import { colors } from "@/presentation/shared/styles/colors";

interface TripMapBottomSheetProps {
  readonly viewModel: TripMapViewModel;
  readonly onOpenDetails: () => void;
}

function TripMapBottomSheet({ viewModel, onOpenDetails }: TripMapBottomSheetProps) {
  const { trip } = viewModel;

  return (
    <View className="rounded-[28px] bg-white/95 p-4 shadow-sm shadow-blue-100">
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">Status da rota</Text>
          <Text className="mt-1 font-bold text-lg text-[#051223]" numberOfLines={1}>
            {viewModel.statusStage.label}
          </Text>
          <Text className="mt-1 text-sm text-[#5E6A7A]" numberOfLines={1}>
            {viewModel.routeFocus?.label ?? "Percurso"}:{" "}
            {viewModel.routeFocus?.value ?? trip.route.name}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver detalhes da rota"
          onPress={onOpenDetails}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF]"
        >
          <MaterialIcons name="info-outline" size={22} color={colors.primaryGlow} />
        </Pressable>
      </View>
    </View>
  );
}

export { TripMapBottomSheet };
