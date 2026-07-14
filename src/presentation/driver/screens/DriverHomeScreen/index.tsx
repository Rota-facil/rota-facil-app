import { MaterialIcons } from "@expo/vector-icons";
import { type Href, Redirect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDriverTrips } from "@/hooks/useDriverTrips";
import { useHome } from "@/hooks/useHome";
import {
  DriverHomeExperience,
  DriverHomeHeader,
} from "@/presentation/driver/components/organisms/driverHomeExperience";
import { HomeNotifications } from "@/presentation/shared/components/organisms/homeNotifications";
import {
  getTripDetailsPermissions,
  isTripWaitingReturn,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
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
    reload,
    user,
  } = useHome("DRIVER");
  const {
    initTrip,
    initTripError,
    initTripReturn,
    isLoading: isDriverTripLoading,
    loadTripStudents,
    students,
  } = useDriverTrips();

  useEffect(() => {
    if (!currentTrip) {
      return;
    }

    void loadTripStudents(currentTrip.id, { silent: true });
  }, [currentTrip, loadTripStudents]);

  const handleRefresh = useCallback(() => {
    void Promise.all([
      reload(),
      currentTrip ? loadTripStudents(currentTrip.id, { silent: true }) : Promise.resolve(null),
    ]);
  }, [currentTrip, loadTripStudents, reload]);
  const handleStartTrip = useCallback(async () => {
    if (!currentTrip) {
      return;
    }

    const startedTrip = isTripWaitingReturn(currentTrip)
      ? await initTripReturn(currentTrip.id)
      : await initTrip(currentTrip.id);

    if (startedTrip) {
      await Promise.all([reload(), loadTripStudents(currentTrip.id, { silent: true })]);
    }
  }, [currentTrip, initTrip, initTripReturn, loadTripStudents, reload]);

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
  const openCurrentTripDetails = () => {
    if (!currentTrip) {
      return;
    }

    router.push(`/(private)/driver/trips/${encodeURIComponent(currentTrip.id)}` as Href);
  };
  const openCurrentTripQrCode = () => {
    if (!currentTrip) {
      return;
    }

    router.push(
      `/(private)/driver/trips/${encodeURIComponent(currentTrip.id)}?openQrCode=1` as Href,
    );
  };
  const isAssignedDriver = Boolean(user && currentTrip && user.id === currentTrip.bus.driver.id);
  const permissions = currentTrip
    ? getTripDetailsPermissions({
        context: "driver",
        isAssignedDriver,
        trip: currentTrip,
      })
    : null;

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={[]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: TAB_SCREEN_SCROLL_BOTTOM_PADDING,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryGlow}
            colors={[colors.primaryGlow]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <DriverHomeHeader
          userName={user.name}
          prefectureName={user.prefecture.name}
          onOpenNotifications={() => router.push("/(private)/driver/notifications")}
        />

        <View className="px-4 pt-5">
          {error ? (
            <View className="rounded-[28px] border border-red-100 bg-white p-5 shadow-sm">
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
          ) : (
            <DriverHomeExperience
              trip={currentTrip}
              students={students}
              canStartTrip={permissions?.canStartTrip ?? false}
              canOpenNavigation={permissions?.canOpenNavigation ?? false}
              canShowCheckInQrCode={permissions?.canShowCheckInQrCode ?? false}
              isActionLoading={isDriverTripLoading}
              actionError={initTripError}
              onOpenTrips={openTrips}
              onOpenDetails={openCurrentTripDetails}
              onOpenNavigation={() => router.push("/(private)/driver/map")}
              onOpenQrCode={openCurrentTripQrCode}
              onStartTrip={() => void handleStartTrip()}
            />
          )}

          <HomeNotifications
            notifications={notifications}
            isLoading={isNotificationsLoading}
            error={notificationsError}
            onViewAll={() => router.push("/(private)/driver/notifications")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DriverHomeScreen;
