import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePrefecture } from "@/hooks/usePrefecture";
import { useUser } from "@/hooks/useUser";
import { PrefectureSelect } from "@/presentation/shared/components/atoms/prefectureSelect";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { colors } from "@/presentation/shared/styles/colors";
import { TAB_SCREEN_SCROLL_BOTTOM_PADDING } from "@/presentation/shared/styles/layout";
import {
  type StudentPrefectureFormSchema,
  studentPrefectureSchema,
} from "@/presentation/student/schemas/studentProfileSchema";

function ChangeStudentPrefectureScreen() {
  const { user, isLoading: isUserLoading, loadUser } = useUser();
  const {
    prefectures,
    isLoading: isPrefectureLoading,
    error,
    loadPrefectures,
    changeUserPrefecture,
  } = usePrefecture();

  const form = useForm<StudentPrefectureFormSchema>({
    resolver: zodResolver(studentPrefectureSchema),
    defaultValues: {
      prefectureId: "",
    },
  });

  useEffect(() => {
    loadUser();
    loadPrefectures();
  }, [loadPrefectures, loadUser]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "STUDENT") {
      router.replace("/(private)/driver/profile");
      return;
    }

    form.reset({ prefectureId: user.prefecture.id });
  }, [form, user]);

  const selectedPrefectureId = form.watch("prefectureId");
  const selectedPrefecture = prefectures.find(
    (prefecture) => prefecture.id === selectedPrefectureId,
  );
  const isCurrentPrefecture = selectedPrefectureId === user?.prefecture.id;
  const isSubmitting = form.formState.isSubmitting || isPrefectureLoading;

  const handleSubmit = async (values: StudentPrefectureFormSchema) => {
    if (!user || isCurrentPrefecture || isPrefectureLoading) {
      return;
    }

    const wasChanged = await changeUserPrefecture(values.prefectureId);

    if (wasChanged) {
      await loadUser();
      router.back();
    }
  };

  if (isUserLoading && !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC]">
        <ActivityIndicator size="large" color={colors.primaryGlow} />
        <Text className="mt-4 text-[#5E6A7A]">Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: TAB_SCREEN_SCROLL_BOTTOM_PADDING }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#102A72", colors.primary, "#0476F8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mb-6 gap-6 rounded-[28px] p-5 pb-8"
        >
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.navigate("/(private)/students/profile")}
              className="h-11 w-11 items-center justify-center rounded-full bg-white/15"
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="font-bold text-2xl text-white">Trocar prefeitura</Text>
              <Text className="mt-1 text-blue-100">Solicite mudança de rede municipal</Text>
            </View>
          </View>

          <View className="mt-5 flex-row items-center rounded-2xl bg-white/15 px-4 py-3">
            <MaterialIcons name="account-balance" size={20} color="#FFFFFF" />
            <Text className="ml-3 flex-1 font-semibold text-sm text-white">
              A prefeitura define a rede municipal vinculada ao estudante.
            </Text>
          </View>
        </LinearGradient>

        <View className="rounded-3xl bg-white mx-5 p-5 shadow-sm shadow-blue-100">
          <View className="mb-5 flex-row items-center">
            <View className="flex-1 rounded-3xl bg-[#EAF3FF] p-4">
              <Text className="font-semibold text-[#5E6A7A] text-xs uppercase">Atual</Text>
              <Text className="mt-1 font-bold text-[#051223]">{user?.prefecture.name ?? "-"}</Text>
            </View>

            <MaterialIcons name="arrow-forward" size={22} color={colors.muted} />

            <View className="flex-1 rounded-3xl bg-[#0D6BEE] p-4">
              <Text className="font-semibold text-blue-100 text-xs uppercase">Desejada</Text>
              <Text className="mt-1 font-bold text-white">
                {selectedPrefecture?.name ?? "Selecione"}
              </Text>
            </View>
          </View>

          {prefectures.length === 0 && !isPrefectureLoading ? (
            <View className="rounded-2xl bg-[#F8FAFC] p-4">
              <Text className="text-center text-[#5E6A7A]">
                Nenhuma prefeitura disponível para seleção.
              </Text>
            </View>
          ) : (
            <PrefectureSelect
              control={form.control}
              name="prefectureId"
              label="NOVA PREFEITURA"
              placeholder="Selecione a prefeitura"
              prefectures={prefectures}
              loading={isPrefectureLoading}
              error={error}
            />
          )}

          <View className="mt-5">
            <SystemButton
              title="Confirmar alteração"
              loading={isSubmitting}
              disabled={isCurrentPrefecture || prefectures.length === 0}
              onPress={form.handleSubmit(handleSubmit)}
              hideIcon
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChangeStudentPrefectureScreen;
