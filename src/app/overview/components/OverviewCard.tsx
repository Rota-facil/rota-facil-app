import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

interface OnboardingCardProps {
  title: string;
  description: string;
  iconName: string;
  iconType: "material" | "feather";
  gradientColors: [string, string];
}

export function OnboardingCard({
  title,
  description,
  iconName,
  iconType,
  gradientColors,
}: OnboardingCardProps) {
  const renderIcon = () => {
    const iconSize = 64;
    const iconColor = "#FFFFFF";

    if (iconType === "material") {
      return <MaterialIcons name={iconName as any} size={iconSize} color={iconColor} />;
    }

    return <Feather name={iconName as any} size={iconSize} color={iconColor} />;
  };

  return (
    <View className="flex-1 items-center justify-center w-full my-8">
      {/* Card do ícone */}
      <View className="relative w-44 h-44">
        <View
          className="w-44 h-44 rounded-[36px]"
          style={{
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 items-center justify-center"
          >
            {/* Quadrado interno */}
            <View className="absolute inset-3 rounded-[32px] bg-white/15" />

            {/* Ícone principal */}
            <View className="z-10">{renderIcon()}</View>

            {/* Badge */}
          </LinearGradient>
        </View>
        <View className="absolute -bottom-4 -right-4 h-12 w-12 rounded-full bg-white items-center justify-center shadow-md border border-slate-100">
          <FontAwesome5 name="bus" size={24} color="#2563EB" />
        </View>
      </View>

      <View className="w-full px-4 mt-12">
        <Text className="mb-3 text-2xl font-bold tracking-tight text-center text-slate-900">
          {title}
        </Text>

        <Text className="px-2 text-lg leading-6 text-center text-slate-500">{description}</Text>
      </View>
    </View>
  );
}
