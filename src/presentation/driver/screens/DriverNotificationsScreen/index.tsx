import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DriverNotifications } from "@/presentation/driver/components/organisms/driverNotifications";

function DriverNotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 bg-[#F7FBFC]">
        <View className="flex-row items-center justify-between px-6 pb-4 pt-5">
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-[#7B8BA3]">
              Central de
            </Text>

            <Text className="mt-1 text-3xl font-bold text-[#051223]">Notificações</Text>
          </View>
        </View>

        <View className="flex-1">
          <DriverNotifications />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default DriverNotificationsScreen;
