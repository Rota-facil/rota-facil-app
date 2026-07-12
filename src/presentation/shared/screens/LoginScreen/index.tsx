import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import EasyRouteLogo from "../../components/atoms/logo";
import { LoginForm } from "../../components/organism/loginForm";
import { type LoginFormSchema, loginSchema } from "../../schemas/loginSchema";
import { colors } from "../../styles/colors";

const defaultScrollBottomPadding = 24;
const keyboardScrollMargin = 32;

export default function LoginScreen() {
  const { login, loginWithGoogle, isLoading, messageError } = useAuth();
  const [scrollBottomPadding, setScrollBottomPadding] = useState(defaultScrollBottomPadding);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const keyboardShowEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardHideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(keyboardShowEvent, (event) => {
      setScrollBottomPadding(event.endCoordinates.height + keyboardScrollMargin);
    });

    const hideSubscription = Keyboard.addListener(keyboardHideEvent, () => {
      setScrollBottomPadding(defaultScrollBottomPadding);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: scrollBottomPadding }}
            showsVerticalScrollIndicator={false}
          >
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
              error={messageError}
              onSubmit={form.handleSubmit(login)}
              onGoogleLogin={loginWithGoogle}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
