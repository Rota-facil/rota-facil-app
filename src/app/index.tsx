import { CirclePlus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const home: React.FC = () => {
  return (
    <SafeAreaProvider>
      <View className="flex flex-1 items-center justify-center bg-gray-500">
        <Text className="text-xl font-bold text-white-500">Welcome to Nativewind!</Text>

        <TouchableOpacity className="bg-black flex flex-row gap-2 p-4 rounded my-2">
          <Text>Touch Me</Text>
          <HugeiconsIcon icon={CirclePlus} color={"#44A5AA"} size={18} opacity={1} />
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

export default home;
