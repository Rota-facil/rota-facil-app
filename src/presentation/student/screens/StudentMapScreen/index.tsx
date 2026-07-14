import { useTripMap } from "@/hooks/useTripMap";
import { TripMapTemplate } from "@/presentation/shared/components/templates/tripMapTemplate";

function StudentMapScreen() {
  const { error, hasLoaded, isLoading, isRefreshing, refreshTripMap, viewModel } = useTripMap();

  return (
    <TripMapTemplate
      context="student"
      viewModel={viewModel}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      hasLoaded={hasLoaded}
      error={error}
      onRefresh={refreshTripMap}
    />
  );
}

export default StudentMapScreen;
