// src/app/overview/components/OverviewButton.tsx

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface OverviewButtonProps {
  title: string;
  onPress: () => void;
}

export function OverviewButton({ title, onPress }: OverviewButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="w-full mt-6">
      <LinearGradient
        colors={["#1E3A8A", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 24,
          shadowColor: "#2563EB",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 8,
        }}
        className="h-14 flex-row items-center justify-center rounded-3xl"
      >
        <Text className="text-white font-semibold text-base mr-2">{title}</Text>

        <MaterialIcons name="chevron-right" size={20} color="#FFFFFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
}
