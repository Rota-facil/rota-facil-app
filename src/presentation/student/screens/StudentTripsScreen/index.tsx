import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { TripEntity, TripPageEntity } from "@/core/entity/tripEntity";
import { useTrips } from "@/hooks/useTrips";
import { TripsPageTemplate } from "@/presentation/shared/components/organisms/tripsPageTemplate";

type StudentTripsView = "all" | "mine";

interface StudentTripsState {
  trips: TripEntity[];
  page: TripPageEntity | null;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasLoaded: boolean;
}

const PAGE_SIZE = 10;

const initialTripsState: StudentTripsState = {
  trips: [],
  page: null,
  isRefreshing: false,
  isLoadingMore: false,
  hasLoaded: false,
};

const viewOptions: { value: StudentTripsView; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "mine", label: "Minhas" },
];

function StudentTripsScreen() {
  const router = useRouter();
  const { isLoading, error, loadTrips, loadMyTrips } = useTrips();
  const [activeView, setActiveView] = useState<StudentTripsView>("all");
  const [allTripsState, setAllTripsState] = useState<StudentTripsState>(initialTripsState);
  const [myTripsState, setMyTripsState] = useState<StudentTripsState>(initialTripsState);

  const activeState = activeView === "all" ? allTripsState : myTripsState;
  const setActiveState = activeView === "all" ? setAllTripsState : setMyTripsState;
  const hasReachedEnd =
    activeView === "mine" ||
    (activeState.page !== null && activeState.page.number + 1 >= activeState.page.totalPages);

  const loadTripsPage = useCallback(
    async (view: StudentTripsView, pageNumber: number, mode: "replace" | "append") => {
      const setViewState = view === "all" ? setAllTripsState : setMyTripsState;

      setViewState((currentState) => ({
        ...currentState,
        isRefreshing: mode === "replace" && currentState.trips.length > 0,
        isLoadingMore: mode === "append",
      }));

      if (view === "mine") {
        const response = await loadMyTrips();

        if (response) {
          setViewState({
            trips: response,
            page: null,
            isRefreshing: false,
            isLoadingMore: false,
            hasLoaded: true,
          });

          return;
        }

        setViewState((currentState) => ({
          ...currentState,
          isRefreshing: false,
          isLoadingMore: false,
          hasLoaded: true,
        }));

        return;
      }

      const response = await loadTrips({ page: pageNumber, size: PAGE_SIZE });

      if (response) {
        setViewState((currentState) => ({
          trips:
            mode === "append" ? [...currentState.trips, ...response.content] : response.content,
          page: response.page,
          isRefreshing: false,
          isLoadingMore: false,
          hasLoaded: true,
        }));

        return;
      }

      setViewState((currentState) => ({
        ...currentState,
        isRefreshing: false,
        isLoadingMore: false,
        hasLoaded: true,
      }));
    },
    [loadMyTrips, loadTrips],
  );

  useEffect(() => {
    if (activeState.hasLoaded || activeState.isRefreshing || activeState.isLoadingMore) {
      return;
    }

    void loadTripsPage(activeView, 0, "replace");
  }, [
    activeState.isLoadingMore,
    activeState.isRefreshing,
    activeState.hasLoaded,
    activeView,
    loadTripsPage,
  ]);

  const handleRefresh = useCallback(() => {
    void loadTripsPage(activeView, 0, "replace");
  }, [activeView, loadTripsPage]);

  const handleLoadMore = useCallback(() => {
    if (
      activeView === "mine" ||
      isLoading ||
      activeState.isLoadingMore ||
      hasReachedEnd ||
      !activeState.page
    ) {
      return;
    }

    void loadTripsPage(activeView, activeState.page.number + 1, "append");
  }, [
    activeState.isLoadingMore,
    activeState.page,
    activeView,
    hasReachedEnd,
    isLoading,
    loadTripsPage,
  ]);

  const handleRetry = useCallback(() => {
    setActiveState((currentState) => ({
      ...currentState,
      trips: [],
      page: null,
      hasLoaded: false,
    }));

    void loadTripsPage(activeView, 0, "replace");
  }, [activeView, loadTripsPage, setActiveState]);

  const handleTripPress = useCallback(
    (tripId: string) => {
      router.push({
        pathname: "/(private)/students/trips/[tripId]",
        params: { tripId },
      });
    },
    [router],
  );

  return (
    <TripsPageTemplate
      trips={activeState.trips}
      context="student"
      isInitialLoading={isLoading && activeState.trips.length === 0}
      isRefreshing={activeState.isRefreshing}
      isLoadingMore={activeState.isLoadingMore}
      hasReachedEnd={hasReachedEnd}
      error={error}
      emptyTitle={activeView === "all" ? "Nenhuma viagem disponível" : "Nenhuma viagem vinculada"}
      emptyDescription={
        activeView === "all"
          ? "As viagens disponíveis para hoje aparecerão aqui."
          : "Quando você estiver cadastrado em uma viagem, ela aparecerá nesta lista."
      }
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      onRetry={handleRetry}
      onTripPress={handleTripPress}
    >
      <View className="flex-row rounded-2xl bg-white p-1 shadow-sm shadow-blue-100">
        {viewOptions.map((option) => {
          const isSelected = option.value === activeView;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={isSelected ? { selected: true } : undefined}
              onPress={() => setActiveView(option.value)}
              className={`h-11 flex-1 items-center justify-center rounded-xl ${
                isSelected ? "bg-[#0D6BEE]" : "bg-white"
              }`}
            >
              <Text className={`font-bold text-sm ${isSelected ? "text-white" : "text-[#5E6A7A]"}`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </TripsPageTemplate>
  );
}

export default StudentTripsScreen;
