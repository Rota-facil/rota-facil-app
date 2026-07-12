import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

const unavailableMapRows = [
  { id: "row-1", top: 60 },
  { id: "row-2", top: 144 },
  { id: "row-3", top: 228 },
  { id: "row-4", top: 312 },
  { id: "row-5", top: 396 },
  { id: "row-6", top: 480 },
  { id: "row-7", top: 564 },
  { id: "row-8", top: 648 },
] as const;

const unavailableMapColumns = [
  { id: "column-1", left: 46 },
  { id: "column-2", left: 138 },
  { id: "column-3", left: 230 },
  { id: "column-4", left: 322 },
  { id: "column-5", left: 414 },
] as const;

function TripMapUnavailableState() {
  return (
    <View className="flex-1 bg-[#DDE8F3]">
      <View className="absolute inset-0 opacity-70">
        {unavailableMapRows.map((row) => (
          <View
            key={row.id}
            className="absolute h-3 rounded-full bg-white"
            style={{ left: 0, right: 0, top: row.top }}
          />
        ))}
        {unavailableMapColumns.map((column) => (
          <View
            key={column.id}
            className="absolute w-3 rounded-full bg-white"
            style={{ bottom: 0, left: column.left, top: 0 }}
          />
        ))}
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center rounded-[28px] bg-white/95 p-5 shadow-sm shadow-blue-100">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
            <MaterialIcons name="location-off" size={26} color={colors.primaryGlow} />
          </View>
          <Text className="mt-4 text-center font-bold text-xl text-[#051223]">
            Coordenadas indisponíveis
          </Text>
          <Text className="mt-2 text-center text-sm text-[#5E6A7A] leading-5">
            A viagem foi encontrada, mas ainda não há pontos geográficos válidos para desenhar o
            trajeto.
          </Text>
        </View>
      </View>
    </View>
  );
}

export { TripMapUnavailableState };
