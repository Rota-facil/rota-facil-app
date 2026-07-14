import { MaterialIcons } from "@expo/vector-icons";
import type { Control } from "react-hook-form";
import { Text, View } from "react-native";
import type { LoginFormSchema } from "@/presentation/shared/schemas/loginSchema";
import { colors } from "@/presentation/shared/styles/colors";
import { FormInput } from "../../atoms/formInput";
import { GoogleButton } from "../../atoms/googleButton";
import { PasswordInput } from "../../atoms/passwordInput";
import { SystemButton } from "../../atoms/systemButton";
import { SystemLink } from "../../atoms/systemLink";
import { FormErrorMessage } from "../../molecules/formErrorMessage";

interface LoginFormProps {
  control: Control<LoginFormSchema>;
  loading?: boolean;
  error?: string | null;
  onSubmit: () => void;
  onGoogleLogin: () => void;
}

export function LoginForm({
  control,
  loading = false,
  error,
  onSubmit,
  onGoogleLogin,
}: LoginFormProps) {
  return (
    <View className="flex flex-col flex-1 p-5">
      <View className="flex flex-col gap-7">
        <FormInput
          control={control}
          name="email"
          label="EMAIL"
          placeholder="voce@email.com"
          leftIcon={<MaterialIcons name="mail-outline" size={20} color={colors.muted} />}
        />

        <PasswordInput
          control={control}
          name="password"
          label="SENHA"
          placeholder="Mínimo de 8 caracteres"
        />
      </View>

      <View className="self-end my-3">
        <SystemLink href="/">Esqueceu a senha?</SystemLink>
      </View>

      <FormErrorMessage message={error} />

      <View className="mt-8 flex flex-col gap-5">
        <SystemButton title="Entrar" onPress={onSubmit} loading={loading} hideIcon />

        <View className="flex flex-row items-center">
          <View className="flex-1 h-[2px] bg-[#E5EAF0]" />
          <Text className="mx-4 text-sm text-[#5E6A7A]">OU</Text>
          <View className="flex-1 h-[2px] bg-[#E5EAF0]" />
        </View>

        <GoogleButton title="Continuar com Google" onPress={onGoogleLogin} loading={loading} />
      </View>

      <View className="mt-auto pt-8 flex-row justify-center">
        <Text className="text-[#5E6A7A]">Não tem conta?</Text>

        <SystemLink href="/(auth)/register" replace>
          Cadastre-se
        </SystemLink>
      </View>
    </View>
  );
}
