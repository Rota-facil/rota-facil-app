import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import type { StudentHomeIconName, StudentJourneyStep } from "./types";
import { getStepBackground } from "./utils";

function InfoPill({
  accent,
  icon,
  label,
}: {
  readonly accent: string;
  readonly icon: StudentHomeIconName;
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
  iconLeft,
  onPress,
  title,
}: {
  readonly accent: string;
  readonly iconLeft: StudentHomeIconName;
  readonly onPress: () => void;
  readonly title: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-14 flex-row items-center justify-between rounded-[22px] px-4 py-3 active:opacity-85"
      style={{ backgroundColor: accent }}
    >
      <View className="flex-row items-center">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
          <MaterialIcons name={iconLeft} size={22} color="#FFFFFF" />
        </View>
        <Text className="ml-3 font-bold text-base text-white">{title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#FFFFFF" />
    </Pressable>
  );
}

function JourneyPanel({
  steps,
  title,
}: {
  readonly steps: StudentJourneyStep[];
  readonly title: string;
}) {
  return (
    <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <Text className="font-bold text-[#051223] text-lg">{title}</Text>
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
  readonly icon: StudentHomeIconName;
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

export { HomeContextAction, InfoPill, JourneyPanel, ShortInfoPanel };
