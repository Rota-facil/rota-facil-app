import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

type CurrentTripCardProps = {
  trip: {
    label: string;
    route: string;
    status: string;
    eta: string;
    progress: string;
    seats: string;
    driver: {
      name: string;
      rating: string;
      vehicle: string;
    };
  };
  onTripPress?: () => void;
};

export function CurrentTripCard({ trip, onTripPress }: CurrentTripCardProps) {
  const gradient = [colors.accent, colors.accentGlow] as const;

  return (
    <View className="-mt-5 w-full rounded-[24px] bg-white p-4 shadow-lg">
      <View className="mb-4 flex-row items-start justify-between">
        <View>
          <Text className="text-[10px] font-bold uppercase text-slate-500">{trip.label}</Text>

          <Text className="mt-1 text-lg font-extrabold text-slate-900">{trip.route}</Text>
        </View>

        <View className="flex-row items-center rounded-full bg-emerald-100 px-3 py-1">
          <View className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />

          <Text className="text-[11px] font-extrabold text-emerald-600">{trip.status}</Text>
        </View>
      </View>

      <View className="relative mb-4 h-[132px] overflow-hidden rounded-[22px] bg-[#eaf2fb] justify-center">
        <Text>mapa</Text>
      </View>

      <View className="mb-4 flex-row gap-2.5">
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="min-h-[76px] flex-1 justify-center rounded-2xl p-3 overflow-hidden"
        >
          <MaterialIcons name="schedule" size={16} color="#111827" />

          <Text className="mt-1 text-[10px] font-bold uppercase text-slate-900">ETA</Text>

          <Text className="mt-0.5 text-lg font-black text-slate-900">{trip.eta}</Text>
        </LinearGradient>

        <View className="min-h-[76px] flex-1 justify-center rounded-2xl bg-blue-50 p-3">
          <MaterialIcons name="my-location" size={16} color="#64748b" />

          <Text className="mt-1 text-[10px] font-bold uppercase text-slate-600">Progresso</Text>

          <Text className="mt-0.5 text-lg font-extrabold text-slate-900">{trip.progress}</Text>
        </View>

        <View className="min-h-[76px] flex-1 justify-center rounded-2xl bg-blue-50 p-3">
          <MaterialIcons name="directions-bus" size={16} color="#64748b" />

          <Text className="mt-1 text-[10px] font-bold uppercase text-slate-600">Vagas</Text>

          <Text className="mt-0.5 text-lg font-extrabold text-slate-900">{trip.seats}</Text>
        </View>
      </View>

      <Pressable
        onPress={onTripPress}
        android_ripple={{ color: "#E2E8F0" }}
        className="mt-2 flex-row items-center border-t border-slate-200 pt-4 active:opacity-80"
      >
        <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-blue-700">
          <Text className="text-[13px] font-extrabold text-white">CO</Text>
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-sm font-extrabold text-slate-900">{trip.driver.name}</Text>

          <Text className="mt-0.5 text-xs text-slate-500">
            ⭐ {trip.driver.rating} · {trip.driver.vehicle}
          </Text>
        </View>

        <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-blue-50">
          <MaterialIcons name="chevron-right" size={24} color="#1e293b" />
        </View>
      </Pressable>
    </View>
  );
}
