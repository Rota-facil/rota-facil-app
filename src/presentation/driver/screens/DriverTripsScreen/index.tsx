import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/presentation/shared/styles/colors";

function DriverTripsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC] px-6 pt-4 pb-28" edges={["top"]}>
      <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
          <MaterialIcons name="directions-bus" size={26} color={colors.primaryGlow} />
        </View>

        <Text className="mt-5 font-bold text-2xl text-[#051223]">Viagens</Text>
        <Text className="mt-2 text-[#5E6A7A] leading-5">
          Nenhuma viagem operacional atribuida ao motorista no momento.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default DriverTripsScreen;
