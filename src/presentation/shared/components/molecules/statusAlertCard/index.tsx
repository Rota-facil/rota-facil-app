import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type StatusAlertCardProps = {
  statusAlert: {
    title: string;
    description: string;
  };
  onPress?: () => void;
};

export function StatusAlertCard({ statusAlert, onPress }: StatusAlertCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full min-h-[78px] flex-row items-center rounded-[22px] bg-white px-4 py-3 shadow-lg"
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
        <MaterialIcons name="pan-tool" size={22} color="#10b981" />
      </View>

      <View className="flex-1">
        <Text className="text-[15px] font-extrabold text-slate-900">{statusAlert.title}</Text>

        <Text className="mt-1 text-xs text-slate-500">{statusAlert.description}</Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color="#1e293b" />
    </Pressable>
  );
}
