import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/useUser";
import { CpfInput } from "@/presentation/shared/components/atoms/cpfInput";
import { FormInput } from "@/presentation/shared/components/atoms/formInput";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { colors } from "@/presentation/shared/styles/colors";
import {
  type StudentProfileFormSchema,
  studentProfileSchema,
} from "@/presentation/student/schemas/studentProfileSchema";

function EditStudentProfileScreen() {
  const { user, isLoading, error, loadUser, updateUser } = useUser();

  const form = useForm<StudentProfileFormSchema>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
    },
  });

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "STUDENT") {
      router.replace("/(private)/driver/profile");
      return;
    }

    form.reset({
      name: user.name,
      email: user.email,
      cpf: user.cpf,
    });
  }, [form, user]);

  const handleSubmit = async (values: StudentProfileFormSchema) => {
    if (!user) {
      return;
    }

    const updatedUser = await updateUser({
      name: values.name,
      email: values.email,
      cpf: values.cpf,
      prefectureId: user.prefecture.id,
    });

    if (updatedUser) {
      router.back();
    }
  };

  if (isLoading && !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7FBFC]">
        <ActivityIndicator size="large" color={colors.primaryGlow} />
        <Text className="mt-4 text-[#5E6A7A]">Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#102A72", colors.primary, "#0476F8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mb-6 gap-6 rounded-[28px] p-5 pb-8"
        >
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white/15"
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="font-bold text-2xl text-white">Editar perfil</Text>
              <Text className="mt-1 text-blue-100">Atualize seus dados pessoais</Text>
            </View>
          </View>

          <View className="mt-5 flex-row items-center rounded-2xl bg-white/15 px-4 py-3">
            <MaterialIcons name="verified-user" size={20} color="#FFFFFF" />
            <Text className="ml-3 flex-1 font-semibold text-sm text-white">
              Mantenha seus dados alinhados ao cadastro municipal.
            </Text>
          </View>
        </LinearGradient>

        {error && (
          <View className="mb-5 rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] p-4">
            <Text className="text-[#991B1B] text-sm">{error}</Text>
          </View>
        )}

        <View className="gap-5 mx-5 rounded-3xl bg-white p-5 shadow-sm shadow-blue-100">
          <FormInput
            control={form.control}
            name="name"
            label="NOME COMPLETO"
            placeholder="Seu nome completo"
            leftIcon={<MaterialIcons name="person-outline" size={20} color={colors.muted} />}
          />

          <FormInput
            control={form.control}
            name="email"
            label="E-MAIL"
            placeholder="voce@email.com"
            leftIcon={<MaterialIcons name="mail-outline" size={20} color={colors.muted} />}
          />

          <CpfInput control={form.control} name="cpf" label="CPF" placeholder="000.000.000-00" />

          <SystemButton
            title="Salvar alterações"
            loading={isLoading || form.formState.isSubmitting}
            disabled={!form.formState.isDirty}
            onPress={form.handleSubmit(handleSubmit)}
            hideIcon
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EditStudentProfileScreen;
