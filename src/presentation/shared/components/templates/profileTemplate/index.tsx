import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/presentation/shared/styles/colors";

interface ProfileMetric {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
}

interface ProfileInfo {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
}

interface ProfileActionGroup {
  title?: string;
  children: React.ReactNode;
}

interface ProfileTemplateProps {
  roleLabel: string;
  name: string;
  email: string;
  organization?: string;
  metrics?: ProfileMetric[];
  infoItems?: ProfileInfo[];
  actionGroups: ProfileActionGroup[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  footer?: string;
  children?: React.ReactNode;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "RF";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ProfileTemplate({
  roleLabel,
  name,
  email,
  organization,
  metrics = [],
  infoItems = [],
  actionGroups,
  loading = false,
  error,
  emptyMessage,
  footer,
  children,
}: ProfileTemplateProps) {
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC]">
        <ActivityIndicator size="large" color={colors.primaryGlow} />
        <Text className="mt-4 text-[#5E6A7A]">Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC] px-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2]">
          <MaterialIcons name="error-outline" size={28} color={colors.stateError} />
        </View>

        <Text className="mt-4 text-center font-bold text-[#051223] text-xl">
          Não foi possível carregar
        </Text>

        <Text className="mt-2 text-center text-[#5E6A7A]">{error}</Text>
      </SafeAreaView>
    );
  }

  if (emptyMessage) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC] px-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#EAF3FF]">
          <MaterialIcons name="person-search" size={28} color={colors.primaryGlow} />
        </View>

        <Text className="mt-4 text-center font-bold text-[#051223] text-xl">
          Perfil indisponível
        </Text>

        <Text className="mt-2 text-center text-[#5E6A7A]">{emptyMessage}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <LinearGradient
          colors={["#102A72", colors.primary, "#0476F8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-b-[32px] pb-8 pt-6"
        >
          <View className="items-center px-5">
            <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-white">
              <Text className="font-bold text-2xl text-[#043DBC]">{getInitials(name)}</Text>
            </View>

            <Text className="mt-5 text-center font-bold text-2xl text-white">{name}</Text>

            <Text className="mt-1 text-center text-blue-100">{email}</Text>

            {organization && (
              <View className="mt-4 flex-row items-center rounded-full bg-white/15 px-4 py-2">
                <MaterialIcons name="account-balance" size={16} color="#FFFFFF" />
                <Text className="ml-2 font-semibold text-sm text-white" numberOfLines={1}>
                  {organization}
                </Text>
              </View>
            )}

            <Text className="mt-3 rounded-full bg-white/15 px-4 py-1 font-semibold text-blue-50 text-xs">
              {roleLabel}
            </Text>
          </View>
        </LinearGradient>

        <View className="px-4">
          {metrics.length > 0 && (
            <View className="-mt-5 mx-5 flex-row rounded-[28px] bg-white px-3 py-4 shadow-lg shadow-blue-100">
              {metrics.map((metric) => (
                <View key={metric.label} className="flex-1 items-center px-1">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#EAF3FF]">
                    <MaterialIcons name={metric.icon} size={20} color={colors.primaryGlow} />
                  </View>

                  <Text className="mt-2 font-bold text-[#051223] text-lg" numberOfLines={1}>
                    {metric.value}
                  </Text>

                  <Text className="text-center text-[#5E6A7A] text-[11px] uppercase">
                    {metric.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {infoItems.length > 0 && (
            <View className="mt-6 gap-3">
              {infoItems.map((info) => (
                <View
                  key={info.label}
                  className="min-h-16 flex-row items-center rounded-3xl bg-white px-4 py-3 shadow-sm shadow-blue-100"
                >
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#EAF3FF]">
                    <MaterialIcons name={info.icon} size={21} color={colors.primaryGlow} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[#5E6A7A] text-xs uppercase">{info.label}</Text>
                    <Text className="mt-1 font-semibold text-[#051223] text-base">
                      {info.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {children}

          <View className="mt-6 gap-5">
            {actionGroups.map((group, index) => (
              <View key={group.title ?? String(index)}>
                {group.title && (
                  <Text className="mb-3 font-semibold text-[#5E6A7A] text-xs uppercase tracking-[1px]">
                    {group.title}
                  </Text>
                )}

                <View className="gap-3">{group.children}</View>
              </View>
            ))}
          </View>

          {footer && <Text className="mt-8 text-center text-[#64748B] text-xs">{footer}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export type { ProfileActionGroup, ProfileInfo, ProfileMetric };
export { ProfileTemplate };
