import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

interface TripMapInfoTileProps {
  readonly iconName: ComponentProps<typeof MaterialIcons>["name"];
  readonly label: string;
  readonly value: string;
}

function TripMapInfoTile({ iconName, label, value }: TripMapInfoTileProps) {
  return (
    <View className="min-h-[74px] flex-1 justify-between rounded-3xl bg-[#EAF3FF] p-3">
      <MaterialIcons name={iconName} size={18} color={colors.primary} />
      <View>
        <Text className="text-[10px] font-bold uppercase text-[#64748B]">{label}</Text>
        <Text className="mt-0.5 font-bold text-sm text-[#051223]" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export { TripMapInfoTile };
