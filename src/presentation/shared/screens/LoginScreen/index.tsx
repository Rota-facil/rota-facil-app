import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import EasyRouteLogo from "../../components/atoms/logo";
import { LoginForm } from "../../components/organism/loginForm";
import { type LoginFormSchema, loginSchema } from "../../schemas/loginSchema";
import { colors } from "../../styles/colors";

export default function LoginScreen() {
  const { login, loginWithGoogle, isLoading } = useAuth();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <SafeAreaProvider>
      <View className="pt-6">
        <LinearGradient
          colors={["#102A72", colors.primary, "#1565D8", colors.primaryGlow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderBottomLeftRadius: 26,
            borderBottomRightRadius: 26,
          }}
          className="h-56 px-5 py-6"
        >
          <View className="flex-row items-center">
            <EasyRouteLogo />

            <View className="ml-3">
              <Text className="font-bold text-white text-lg">Rota Fácil</Text>

              <Text
                className="tracking-[3px] text-[10px]"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                TRANSPORTE ESCOLAR
              </Text>
            </View>
          </View>

          <View className="mt-auto">
            <Text className="text-white text-3xl font-bold">Bem vindo de volta</Text>

            <Text className="mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
              Entre para acompanhar suas viagens.
            </Text>
          </View>
        </LinearGradient>
      </View>

      <LoginForm
        control={form.control}
        loading={isLoading}
        onSubmit={form.handleSubmit(login)}
        onGoogleLogin={loginWithGoogle}
      />
    </SafeAreaProvider>
  );
}
