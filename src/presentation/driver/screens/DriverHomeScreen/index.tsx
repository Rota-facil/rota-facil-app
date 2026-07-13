import { MaterialIcons } from "@expo/vector-icons";
import { type Href, Redirect, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHome } from "@/hooks/useHome";
import { ActionCard } from "@/presentation/shared/components/molecules/actionCard";
import { GreetingCard } from "@/presentation/shared/components/molecules/greetingCard";
import { HomeTripCard } from "@/presentation/shared/components/molecules/homeTripCard";
import { NoActiveTripCard } from "@/presentation/shared/components/molecules/noActiveTripCard";
import { QrCodeDisplay } from "@/presentation/shared/components/molecules/qrCodeDisplay";
import { HomeNotifications } from "@/presentation/shared/components/organisms/homeNotifications";
import { colors } from "@/presentation/shared/styles/colors";
import { TAB_SCREEN_SCROLL_BOTTOM_PADDING } from "@/presentation/shared/styles/layout";

function DriverHomeScreen() {
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
    qrCodeError,
    qrCodeValue,
    reload,
    user,
  } = useHome("DRIVER");

  if (!hasLoaded || isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC]" edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primaryGlow} />
        <Text className="mt-4 text-[#5E6A7A]">Carregando sua Home...</Text>
      </SafeAreaView>
    );
  }

  if (user && user.role !== "DRIVER") {
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

  const openTrips = () => router.push("/(private)/driver/trips");

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top"]}>
      <GreetingCard
        greeting="Olá,"
        userName={user.name}
        organization={user.prefecture.name}
        onPressNotification={() => router.push("/(private)/driver/notifications")}
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
          <View className="-mt-5 rounded-[28px] border border-red-100 bg-white p-5 shadow-sm">
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
            detailLabel="Veículo"
            detailValue={currentTrip.bus.plate || "Placa não informada"}
            onPress={() =>
              router.push(`/(private)/driver/trips/${encodeURIComponent(currentTrip.id)}` as Href)
            }
          />
        ) : (
          <NoActiveTripCard onViewTrips={openTrips} />
        )}

        {currentTrip && !error ? (
          <>
            <View className="mt-5">
              <ActionCard
                title="Mapa da viagem"
                subtitle="Acessar rota atual"
                icon="near-me"
                onPress={() => router.push("/(private)/driver/map")}
              />
            </View>

            <View className="mt-6">
              {qrCodeValue ? (
                <QrCodeDisplay
                  value={qrCodeValue}
                  size={200}
                  title="QR Code da viagem"
                  description="Apresente este código para o check-in dos estudantes."
                  helperText="O código identifica exclusivamente a viagem atual."
                  accessibilityLabel="QR Code de check-in da viagem atual"
                />
              ) : (
                <View className="rounded-[28px] border border-red-100 bg-white p-5">
                  <MaterialIcons name="qr-code-2" size={30} color={colors.stateError} />
                  <Text className="mt-3 font-bold text-[#051223] text-lg">
                    QR Code indisponível
                  </Text>
                  <Text className="mt-2 text-[#5E6A7A]">
                    {qrCodeError ?? "Não foi possível preparar o QR Code desta viagem."}
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : null}

        <HomeNotifications
          notifications={notifications}
          isLoading={isNotificationsLoading}
          error={notificationsError}
          onViewAll={() => router.push("/(private)/driver/notifications")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default DriverHomeScreen;
