import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

interface OnboardingHeaderProps {
  onSkip: () => void;
  showSkip: boolean;
}

export function OnboardingHeader({ onSkip, showSkip }: OnboardingHeaderProps) {
  const colorPrimary = "#2563EB";
  const colorAccent = "#F59E0B";

  return (
    <View className="w-full flex-row items-center justify-between py-4">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        {/* Logo */}
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

              <Rect x="7.5" y="11.5" width="5" height="4" rx="1" fill={colorPrimary} />

              <Rect x="14" y="11.5" width="5" height="4" rx="1" fill={colorPrimary} />

              <Rect x="20.5" y="11.5" width="4" height="4" rx="1" fill={colorAccent} />

              <Circle cx="10" cy="24" r="2.2" fill={colorPrimary} />

              <Circle cx="22" cy="24" r="2.2" fill={colorPrimary} />

              <Circle cx="26" cy="7" r="3.5" fill={colorAccent} />

              <Circle cx="26" cy="7" r="1.2" fill="white" />
            </Svg>
          </LinearGradient>
        </View>

        <View className="justify-center" style={{ marginTop: 1 }}>
          <Text className="text-[16px] font-bold text-slate-900">Rota Fácil</Text>

          <Text
            className="text-[10px] uppercase text-slate-500"
            style={{
              letterSpacing: 2,
              fontWeight: "500",
            }}
          >
            Transporte Escolar
          </Text>
        </View>
      </View>

      {/* Botão Pular */}
      {showSkip && (
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} className="px-1 py-1">
          <Text className="text-sm font-semibold text-slate-500">Pular</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
