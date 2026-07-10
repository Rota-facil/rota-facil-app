import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDriver } from "@/hooks/useDriver";
import { colors } from "@/presentation/shared/styles/colors";

function getBusStatusLabel(status: string) {
  return status === "OPERATION" ? "Em operação" : "Fora de operação";
}

function getDriverStatusLabel(status: string) {
  return status === "ON_ROUTE" ? "Em rota" : "Disponível";
}

function DriverBusScreen() {
  const { driver, isLoading, error, loadDriver } = useDriver();

  useEffect(() => {
    loadDriver();
  }, [loadDriver]);

  if (isLoading && !driver) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC]">
        <ActivityIndicator size="large" color={colors.primaryGlow} />
        <Text className="mt-4 text-[#5E6A7A]">Carregando dados do motorista...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 132 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#F59E0B", colors.accent, "#FDE68A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-b-[32px] px-6 pb-8 pt-5"
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.navigate("/(private)/driver/profile")}
              className="h-12 w-12 items-center justify-center rounded-full bg-white/20"
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="ml-4">
              <Text className="font-semibold text-white/80 text-xs uppercase">Veículo</Text>
              <Text className="font-bold text-2xl text-white">Meu ônibus</Text>
            </View>
          </View>

          {driver && (
            <View className="mt-7 rounded-[28px] bg-white/20 p-5">
              <View className="flex-row items-center">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
                  <MaterialIcons name="directions-bus" size={30} color={colors.accentGlow} />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-white/80 text-xs uppercase">Placa</Text>
                  <Text className="font-bold text-3xl text-white">{driver.bus.plate}</Text>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>

        <View className="px-6 pt-6">
          {error ? (
            <View className="rounded-3xl border border-[#FCA5A5] bg-[#FEF2F2] p-5">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
                <MaterialIcons name="error-outline" size={26} color={colors.stateError} />
              </View>

              <Text className="mt-4 font-bold text-[#991B1B] text-lg">
                Não foi possível carregar
              </Text>

              <Text className="mt-2 text-[#7F1D1D]">{error}</Text>
            </View>
          ) : driver ? (
            <View className="rounded-3xl bg-white p-6 shadow-sm shadow-blue-100">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-[#5E6A7A] text-xs uppercase">Capacidade</Text>
                  <Text className="mt-1 font-bold text-3xl text-[#051223]">
                    {driver.bus.capacity}
                  </Text>
                </View>

                <View className="rounded-full bg-[#FEF3C7] px-4 py-2">
                  <Text className="font-semibold text-[#92400E] text-xs">
                    {getBusStatusLabel(driver.bus.status)}
                  </Text>
                </View>
              </View>

              <View className="mt-6 gap-3">
                <View className="min-h-16 flex-row items-center rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white">
                    <MaterialIcons name="confirmation-number" size={21} color={colors.accentGlow} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[#92400E] text-xs uppercase">Identificador</Text>
                    <Text className="mt-1 font-semibold text-[#051223]" numberOfLines={1}>
                      {driver.bus.id}
                    </Text>
                  </View>
                </View>

                <View className="min-h-16 flex-row items-center rounded-2xl border border-[#E5EAF0] bg-white px-4 py-3">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#EAF3FF]">
                    <MaterialIcons name="person-outline" size={21} color={colors.primaryGlow} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[#5E6A7A] text-xs uppercase">Motorista</Text>
                    <Text className="mt-1 font-semibold text-[#051223]" numberOfLines={1}>
                      {driver.name}
                    </Text>
                    <Text className="mt-1 text-[#5E6A7A] text-xs">
                      {getDriverStatusLabel(driver.status)}
                    </Text>
                  </View>
                </View>

                <View className="min-h-16 flex-row items-center rounded-2xl border border-[#E5EAF0] bg-white px-4 py-3">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#EAF3FF]">
                    <MaterialIcons name="account-balance" size={21} color={colors.primaryGlow} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[#5E6A7A] text-xs uppercase">Prefeitura</Text>
                    <Text className="mt-1 font-semibold text-[#051223]" numberOfLines={1}>
                      {driver.prefecture.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="rounded-3xl bg-white p-6 shadow-sm shadow-blue-100">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FEF3C7]">
                <MaterialIcons name="directions-bus" size={28} color={colors.accentGlow} />
              </View>

              <Text className="mt-5 font-bold text-[#051223] text-xl">Ônibus indisponível</Text>

              <Text className="mt-2 text-[#5E6A7A] leading-5">
                Não foi possível identificar os dados completos do motorista autenticado.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DriverBusScreen;
