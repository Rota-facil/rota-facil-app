import type { ReactNode } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TripEntity } from "@/core/entity/tripEntity";
import { colors } from "@/presentation/shared/styles/colors";
import { TripCard } from "../../molecules/tripCard";
import { TripsStateView } from "../../molecules/tripsStateView";

interface TripsPageTemplateProps {
  trips: TripEntity[];
  context: "student" | "driver";
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasReachedEnd: boolean;
  error: string | null;
  emptyTitle: string;
  emptyDescription: string;
  children?: ReactNode;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onTripPress: (tripId: string) => void;
}

function TripsPageTemplate({
  trips,
  context,
  isInitialLoading,
  isRefreshing,
  isLoadingMore,
  hasReachedEnd,
  error,
  emptyTitle,
  emptyDescription,
  children,
  onRefresh,
  onLoadMore,
  onRetry,
  onTripPress,
}: TripsPageTemplateProps) {
  const shouldShowInitialLoading = isInitialLoading && trips.length === 0;
  const shouldShowError = Boolean(error) && trips.length === 0;
  const shouldShowEmpty = !isInitialLoading && !error && trips.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top"]}>
      <FlatList
        data={trips}
        keyExtractor={(trip) => trip.id}
        contentContainerClassName="px-6 pt-4 pb-32 gap-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryGlow}
            colors={[colors.primaryGlow]}
          />
        }
        ListHeaderComponent={
          <View className="gap-4">
            {children}

            {shouldShowInitialLoading ? (
              <TripsStateView
                variant="loading"
                title="Buscando viagens"
                description="Carregando as viagens disponíveis para hoje."
              />
            ) : null}

            {shouldShowError ? (
              <TripsStateView
                variant="error"
                title="Não foi possível carregar"
                description={error ?? "Tente novamente para buscar as viagens do dia."}
                actionLabel="Tentar novamente"
                onActionPress={onRetry}
              />
            ) : null}

            {shouldShowEmpty ? (
              <TripsStateView variant="empty" title={emptyTitle} description={emptyDescription} />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <TripCard trip={item} context={context} onPress={() => onTripPress(item.id)} />
        )}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          trips.length > 0 ? (
            <View className="items-center py-2">
              {isLoadingMore ? (
                <View className="flex-row items-center rounded-full bg-white px-4 py-3 shadow-sm shadow-blue-100">
                  <Text className="font-semibold text-sm text-[#5E6A7A]">
                    Buscando mais viagens
                  </Text>
                </View>
              ) : null}

              {!isLoadingMore && hasReachedEnd ? (
                <View className="rounded-full bg-white px-4 py-3 shadow-sm shadow-blue-100">
                  <Text className="font-semibold text-sm text-[#5E6A7A]">
                    Todas as viagens de hoje foram carregadas.
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

export { TripsPageTemplate };
