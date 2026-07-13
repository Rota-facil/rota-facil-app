import { MaterialIcons } from "@expo/vector-icons";
import { type Href, Redirect, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QR_CODE_TYPES } from "@/core/entity/qrCodeEntity";
import { useHome } from "@/hooks/useHome";
import { ActionCard } from "@/presentation/shared/components/molecules/actionCard";
import { GreetingCard } from "@/presentation/shared/components/molecules/greetingCard";
import { HomeTripCard } from "@/presentation/shared/components/molecules/homeTripCard";
import { NoActiveTripCard } from "@/presentation/shared/components/molecules/noActiveTripCard";
import { HomeNotifications } from "@/presentation/shared/components/organisms/homeNotifications";
import {
  getTripStatusLabel,
  isTripInProgress,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import { colors } from "@/presentation/shared/styles/colors";
import { TAB_SCREEN_SCROLL_BOTTOM_PADDING } from "@/presentation/shared/styles/layout";

function StudentHomeScreen() {
  const router = useRouter();
  const {
    currentTrip,
    error,
    hasLoaded,
    isLoading,
    isNotificationsLoading,
    isRefreshing,
    notifications,
    notificationsError,
    reload,
    user,
  } = useHome("STUDENT");

  if (!hasLoaded || isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC]" edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primaryGlow} />
        <Text className="mt-4 text-[#5E6A7A]">Carregando sua Home...</Text>
      </SafeAreaView>
    );
  }

  if (user && user.role !== "STUDENT") {
    return <Redirect href="/(private)" />;
  }

  if (!user) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-[#F7FBFC] px-6"
        edges={["top"]}
      >
        <MaterialIcons name="error-outline" size={38} color={colors.stateError} />
        <Text className="mt-4 text-center font-bold text-[#051223] text-xl">
          Não foi possível carregar sua conta
        </Text>
        <Text className="mt-2 text-center text-[#5E6A7A]">{error}</Text>
        <Pressable
          onPress={() => void reload()}
          className="mt-6 rounded-full bg-[#0D6BEE] px-6 py-3"
        >
          <Text className="font-semibold text-white">Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const openTrips = () => router.push("/(private)/students/trips");
  const openCurrentTripDetails = () => {
    if (!currentTrip) {
      return;
    }

    router.push(`/(private)/students/trips/${encodeURIComponent(currentTrip.id)}` as Href);
  };
  const openCheckIn = () => {
    if (!currentTrip) {
      return;
    }

    const params = new URLSearchParams({
      description: "Aponte a câmera para o QR Code apresentado pelo motorista.",
      expectedTripId: currentTrip.id,
      expectedType: QR_CODE_TYPES.TRIP_CHECK_IN,
      successDescription: "Sua presença foi registrada nesta viagem.",
      successTitle: "Check-in confirmado",
      title: "Escanear QR Code",
    });

    router.push(`/(private)/qr-code/scan?${params.toString()}` as Href);
  };
  const hasTripInProgress = currentTrip ? isTripInProgress(currentTrip) : false;

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top"]}>
      <GreetingCard
        greeting="Olá,"
        userName={user.name}
        organization={user.prefecture.name}
        summaryDescription={currentTrip ? getTripStatusLabel(currentTrip) : undefined}
        summaryIcon="route"
        summaryLabel={currentTrip ? "Rota vinculada" : undefined}
        summaryValue={currentTrip?.route.name}
        onPressNotification={() => router.push("/(private)/students/notifications")}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: TAB_SCREEN_SCROLL_BOTTOM_PADDING }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={reload}
            tintColor={colors.primaryGlow}
            colors={[colors.primaryGlow]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View className="-mt-6 rounded-[28px] border border-red-100 bg-white p-5 shadow-sm">
            <MaterialIcons name="error-outline" size={28} color={colors.stateError} />
            <Text className="mt-3 font-bold text-[#051223] text-lg">Viagem indisponível</Text>
            <Text className="mt-2 text-[#5E6A7A]">{error}</Text>
            <Pressable
              onPress={() => void reload()}
              className="mt-4 self-start rounded-full bg-[#0D6BEE] px-5 py-3"
            >
              <Text className="font-semibold text-white">Tentar novamente</Text>
            </Pressable>
          </View>
        ) : currentTrip ? (
          <HomeTripCard
            trip={currentTrip}
            detailLabel="Motorista e veículo"
            detailValue={`${currentTrip.bus.driver.name} · ${currentTrip.bus.plate || "Placa não informada"}`}
            onPress={openCurrentTripDetails}
          />
        ) : (
          <NoActiveTripCard onViewTrips={openTrips} />
        )}

        {currentTrip && !error ? (
          <View className="mt-5 gap-3">
            {hasTripInProgress ? (
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <ActionCard
                    title="Check-in"
                    subtitle="Escanear QR Code"
                    icon="qr-code-scanner"
                    variant="accent"
                    onPress={openCheckIn}
                  />
                </View>
                <View className="flex-1">
                  <ActionCard
                    title="Mapa"
                    subtitle="Acompanhar ônibus"
                    icon="location-on"
                    variant="primary"
                    onPress={() => router.push("/(private)/students/map")}
                  />
                </View>
              </View>
            ) : null}

            <View>
              <ActionCard
                title="Detalhes da viagem"
                subtitle="Rota, horários e participação"
                icon="directions-bus"
                variant="neutral"
                onPress={openCurrentTripDetails}
              />
            </View>
          </View>
        ) : null}

        <HomeNotifications
          notifications={notifications}
          isLoading={isNotificationsLoading}
          error={notificationsError}
          onViewAll={() => router.push("/(private)/students/notifications")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default StudentHomeScreen;
