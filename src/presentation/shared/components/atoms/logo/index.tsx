import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import { colors } from "@/presentation/shared/styles/colors";

const EasyRouteLogo = () => {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        shadowColor: "#2563EB",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={["#1E3A8A", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg viewBox="0 0 32 32" width={24} height={24} fill="none">
          <Rect x="5" y="9" width="22" height="14" rx="3.5" fill="white" />

          <Rect x="7.5" y="11.5" width="5" height="4" rx="1" fill={colors.primary} />

          <Rect x="14" y="11.5" width="5" height="4" rx="1" fill={colors.primary} />

          <Rect x="20.5" y="11.5" width="4" height="4" rx="1" fill={colors.accent} />

          <Circle cx="10" cy="24" r="2.2" fill={colors.primary} />

          <Circle cx="22" cy="24" r="2.2" fill={colors.primary} />

          <Circle cx="26" cy="7" r="3.5" fill={colors.accent} />

          <Circle cx="26" cy="7" r="1.2" fill="white" />
        </Svg>
      </LinearGradient>
    </View>
  );
};

export default EasyRouteLogo;
