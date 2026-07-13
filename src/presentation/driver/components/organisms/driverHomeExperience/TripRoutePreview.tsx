import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "@/presentation/shared/styles/colors";

function TripRoutePreview({
  accent,
  isCancelled,
}: {
  readonly accent: string;
  readonly isCancelled: boolean;
}) {
  return (
    <View className="h-36 bg-[#EEF4FA]">
      <Svg width="100%" height="100%" viewBox="0 0 360 150">
        <Path
          d="M-10 36 H102 C138 36 156 62 188 62 H370"
          stroke="#D8E7F7"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M-14 116 H92 C132 116 139 86 174 80 L236 68 C274 60 296 36 348 28"
          stroke="#D8E7F7"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M42 118 C92 92 120 76 154 76 C204 76 238 52 322 30"
          stroke={isCancelled ? colors.accentGlow : colors.primaryGlow}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M42 118 C92 92 120 76 154 76 C204 76 238 52 322 30"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="7 9"
        />
        {isCancelled ? (
          <Path
            d="M178 58 L202 82 M202 58 L178 82"
            stroke={colors.stateError}
            strokeWidth="6"
            strokeLinecap="round"
          />
        ) : null}
        <Circle cx="42" cy="118" r="9" fill={colors.stateSuccess} />
        <Circle cx="322" cy="30" r="9" fill={colors.accentGlow} />
      </Svg>

      <View className="absolute left-[46%] top-[48px] h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm shadow-blue-100">
        <MaterialIcons name={isCancelled ? "block" : "directions-bus"} size={28} color={accent} />
      </View>
    </View>
  );
}

export { TripRoutePreview };
