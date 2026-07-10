import { MaterialIcons } from "@expo/vector-icons";
import type { Control } from "react-hook-form";
import { Text, View } from "react-native";
import type { PrefectureEntity } from "@/core/entity/prefectureEntity";
import type { RegisterFormSchema } from "@/presentation/shared/schemas/registerSchema";
import { colors } from "@/presentation/shared/styles/colors";
import { CpfInput } from "../../atoms/cpfInput";
import { FormInput } from "../../atoms/formInput";
import { PasswordInput } from "../../atoms/passwordInput";
import { PrefectureSelect } from "../../atoms/prefectureSelect";
import { SystemButton } from "../../atoms/systemButton";
import { FormErrorMessage } from "../../molecules/formErrorMessage";

interface RegisterFormProps {
  control: Control<RegisterFormSchema>;
  prefectures: PrefectureEntity[];
  loading?: boolean;
  error?: string | null;
  prefecturesLoading?: boolean;
  prefecturesError?: string | null;
  onSubmit: () => void;
}

function RegisterForm({
  control,
  prefectures,
  loading = false,
  error,
  prefecturesLoading = false,
  prefecturesError,
  onSubmit,
}: RegisterFormProps) {
  return (
    <View className="gap-5">
      <FormInput
        control={control}
        name="name"
        label="NOME COMPLETO"
        placeholder="Ana Beatriz Silva"
        leftIcon={<MaterialIcons name="person-outline" size={20} color={colors.muted} />}
      />

      <FormInput
        control={control}
        name="email"
        label="E-MAIL"
        placeholder="voce@email.com"
        leftIcon={<MaterialIcons name="mail-outline" size={20} color={colors.muted} />}
      />

      <CpfInput control={control} name="cpf" label="CPF" placeholder="000.000.000-00" />

      <PrefectureSelect
        control={control}
        name="prefectureId"
        label="PREFEITURA *"
        placeholder="Selecione sua prefeitura"
        prefectures={prefectures}
        loading={prefecturesLoading}
        error={prefecturesError}
      />

      <PasswordInput
        control={control}
        name="password"
        label="SENHA"
        placeholder="Mínimo 8 caracteres"
      />

      <FormErrorMessage message={error} />

      <View className="mt-1 gap-4">
        <SystemButton title="Criar conta" onPress={onSubmit} loading={loading} hideIcon />

        <Text className="text-center text-xs leading-5 text-[#5E6A7A]">
          Ao continuar, você concorda com os{" "}
          <Text className="font-semibold text-[#051223]">Termos</Text> e{" "}
          <Text className="font-semibold text-[#051223]">Privacidade</Text>.
        </Text>
      </View>
    </View>
  );
}

export { RegisterForm };
