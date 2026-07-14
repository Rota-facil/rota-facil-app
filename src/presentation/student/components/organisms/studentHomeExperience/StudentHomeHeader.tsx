import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { getFirstName, getGreeting } from "./utils";

interface StudentHomeHeaderProps {
  readonly onOpenNotifications: () => void;
  readonly prefectureName: string;
  readonly userName: string;
}

function StudentHomeHeader({
  onOpenNotifications,
  prefectureName,
  userName,
}: StudentHomeHeaderProps) {
  const firstName = getFirstName(userName);
  const greeting = getGreeting();

  return (
    <LinearGradient
      colors={["#1E3A8A", "#0D6BEE", "#1D8CFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full overflow-hidden rounded-b-[28px] px-5 pb-6 pt-12 shadow-sm shadow-blue-100"
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="font-bold text-blue-100 text-sm uppercase">{greeting}</Text>
          <Text className="mt-1 font-bold text-4xl text-white" numberOfLines={2}>
            {firstName}
          </Text>
          <Text className="my-2 text-blue-100 text-sm" numberOfLines={1}>
            Prefeitura de {prefectureName}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir notificações"
          onPress={onOpenNotifications}
          className="h-12 w-12 items-center justify-center rounded-full bg-white/15 active:opacity-85"
        >
          <MaterialIcons name="notifications-none" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

export { StudentHomeHeader };
