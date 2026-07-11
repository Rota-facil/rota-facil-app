import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DriverNotifications } from "@/presentation/driver/components/organisms/driverNotifications";

function DriverNotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#ffffff]" edges={["top"]}>
      <View className="flex-1 bg-[#F7FBFC]">
        <LinearGradient
          colors={["#043DBC", "#075DDD", "#087AF8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full px-6 pb-8 pt-5"
          style={{
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            overflow: "hidden",
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-semibold text-blue-100 text-xs uppercase tracking-[1px]">
                Central
              </Text>

              <Text className="mt-1 font-bold text-3xl text-white">Notificações</Text>

              <Text className="mt-2 text-blue-100 leading-5">
                Atualizações sobre suas viagens e operações de transporte.
              </Text>
            </View>

            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#06388F]">
              <MaterialIcons name="notifications-none" size={27} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        <View className="flex-1">
          <DriverNotifications />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default DriverNotificationsScreen;
