import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import type { DriverHomeIconName, DriverOperationStep } from "./types";
import { getStepBackground } from "./utils";

function InfoPill({
  accent,
  icon,
  label,
}: {
  readonly accent: string;
  readonly icon: DriverHomeIconName;
  readonly label: string;
}) {
  return (
    <View className="flex-row items-center rounded-full bg-[#F8FAFC] px-3 py-2">
      <MaterialIcons name={icon} size={16} color={accent} />
      <Text className="ml-2 font-semibold text-[#334155] text-xs">{label}</Text>
    </View>
  );
}

function HomeContextAction({
  accent,
  disabled = false,
  iconLeft,
  loading = false,
  onPress,
  title,
}: {
  readonly accent: string;
  readonly disabled?: boolean;
  readonly iconLeft: DriverHomeIconName;
  readonly loading?: boolean;
  readonly onPress: () => void;
  readonly title: string;
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      className="min-h-14 flex-row items-center justify-between rounded-[22px] px-4 py-3 active:opacity-85"
      style={{ backgroundColor: isDisabled ? "#CBD5E1" : accent }}
    >
      <View className="flex-row items-center">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
          <MaterialIcons name={loading ? "hourglass-empty" : iconLeft} size={22} color="#FFFFFF" />
        </View>
        <Text className="ml-3 font-bold text-base text-white">
          {loading ? "Processando..." : title}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#FFFFFF" />
    </Pressable>
  );
}

function SecondaryAction({
  accent,
  icon,
  label,
  onPress,
}: {
  readonly accent: string;
  readonly icon: DriverHomeIconName;
  readonly label: string;
  readonly onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-12 flex-1 flex-row items-center justify-center rounded-2xl bg-white px-3 py-3 active:opacity-85"
    >
      <MaterialIcons name={icon} size={20} color={accent} />
      <Text className="ml-2 font-bold text-[#334155] text-sm">{label}</Text>
    </Pressable>
  );
}

function OperationJourneyPanel({ steps }: { readonly steps: DriverOperationStep[] }) {
  return (
    <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <Text className="font-bold text-[#051223] text-lg">Jornada da operação</Text>
      <View className="mt-4 gap-3">
        {steps.map((step, index) => (
          <View key={step.label} className="flex-row">
            <View className="items-center">
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: getStepBackground(step.state) }}
              >
                <MaterialIcons
                  name={step.state === "done" ? "check" : "fiber-manual-record"}
                  size={step.state === "pending" ? 13 : 18}
                  color={step.state === "pending" ? colors.muted : "#FFFFFF"}
                />
              </View>
              {index < steps.length - 1 ? <View className="mt-2 h-5 w-0.5 bg-[#E5EAF0]" /> : null}
            </View>
            <Text
              className="ml-3 flex-1 pt-1.5 font-semibold text-sm"
              style={{ color: step.state === "pending" ? colors.muted : colors.textDefault }}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ShortInfoPanel({
  accent,
  description,
  icon,
  title,
}: {
  readonly accent: string;
  readonly description: string;
  readonly icon: DriverHomeIconName;
  readonly title: string;
}) {
  return (
    <View className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-sm shadow-blue-100">
      <View className="flex-row items-start">
        <View
          className="h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${accent}1A` }}
        >
          <MaterialIcons name={icon} size={21} color={accent} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-bold text-[#051223] text-lg">{title}</Text>
          <Text className="mt-1 text-[#5E6A7A] leading-6">{description}</Text>
        </View>
      </View>
    </View>
  );
}

function ActionErrorPanel({ message }: { readonly message: string }) {
  return (
    <View className="flex-row items-start rounded-[24px] border border-[#FECACA] bg-[#FEF2F2] p-4">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        <MaterialIcons name="error-outline" size={22} color={colors.stateError} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-bold text-[#B91C1C] text-xs uppercase">Ação indisponível</Text>
        <Text className="mt-1 text-[#7F1D1D] text-sm leading-5">{message}</Text>
      </View>
    </View>
  );
}

export {
  ActionErrorPanel,
  HomeContextAction,
  InfoPill,
  OperationJourneyPanel,
  SecondaryAction,
  ShortInfoPanel,
};
