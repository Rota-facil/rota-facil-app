import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TripMapContext, TripMapViewModel } from "@/hooks/tripMapModel";
import { TripsStateView } from "@/presentation/shared/components/molecules/tripsStateView";
import { colors } from "@/presentation/shared/styles/colors";
import { TripMapBottomSheet } from "./components/TripMapBottomSheet";
import { TripMapDetailsModal } from "./components/TripMapDetailsModal";
import { TripMapHeader } from "./components/TripMapHeader";
import { TripMapUnavailableState } from "./components/TripMapUnavailableState";
import { TripNativeMapView } from "./nativeMap/TripNativeMapView";

interface TripMapTemplateProps {
  readonly context: TripMapContext;
  readonly viewModel: TripMapViewModel | null;
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly hasLoaded: boolean;
  readonly error: string | null;
  readonly onRefresh: () => void;
}

function TripMapTemplate({
  context,
  viewModel,
  isLoading,
  isRefreshing,
  hasLoaded,
  error,
  onRefresh,
}: TripMapTemplateProps) {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  if (isLoading && !viewModel) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7FBFC] px-6 pt-4 pb-28" edges={["top"]}>
        <TripsStateView
          variant="loading"
          title="Carregando acompanhamento"
          description="Buscando a viagem vinculada ao seu usuário."
        />
      </SafeAreaView>
    );
  }

  if (error && !viewModel) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7FBFC] px-6 pt-4 pb-28" edges={["top"]}>
        <TripsStateView
          variant="error"
          title="Não foi possível carregar"
          description={error}
          actionLabel="Tentar novamente"
          onActionPress={onRefresh}
        />
      </SafeAreaView>
    );
  }

  if (hasLoaded && !viewModel) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7FBFC] px-6 pt-4 pb-28" edges={["top"]}>
        <TripsStateView
          variant="empty"
          title="Nenhuma viagem para acompanhar"
          description={
            context === "driver"
              ? "Quando houver uma viagem atribuída ou acessada por você, o trajeto aparecerá aqui."
              : "Quando você estiver vinculado a uma viagem, o trajeto aparecerá aqui."
          }
          actionLabel="Atualizar"
          onActionPress={onRefresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#DDE8F3]" edges={["top"]}>
      <View className="flex-1">
        {viewModel?.hasGeographicData ? (
          <TripNativeMapView viewModel={viewModel} />
        ) : (
          <TripMapUnavailableState />
        )}

        {viewModel ? (
          <>
            <View className="absolute top-4 left-5 right-5">
              <TripMapHeader viewModel={viewModel} onRefresh={onRefresh} />
              {error ? (
                <View className="mt-3 flex-row items-center rounded-2xl bg-red-50 px-4 py-3 shadow-sm shadow-red-100">
                  <MaterialIcons name="error-outline" size={18} color={colors.stateError} />
                  <Text className="ml-2 flex-1 font-semibold text-sm text-red-700">{error}</Text>
                </View>
              ) : null}
            </View>

            {viewModel.hasStarted ? (
              <View className="absolute left-5 right-5 bottom-8 pb-24">
                <TripMapBottomSheet
                  viewModel={viewModel}
                  onOpenDetails={() => setIsDetailsModalVisible(true)}
                />
              </View>
            ) : null}

            {isRefreshing ? (
              <View className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm shadow-blue-100">
                <ActivityIndicator color={colors.primaryGlow} />
              </View>
            ) : null}

            {viewModel.hasStarted ? (
              <TripMapDetailsModal
                visible={isDetailsModalVisible}
                viewModel={viewModel}
                onClose={() => setIsDetailsModalVisible(false)}
              />
            ) : null}
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export { TripMapTemplate };
