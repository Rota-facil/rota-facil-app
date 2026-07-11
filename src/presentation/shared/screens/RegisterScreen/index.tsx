import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { usePrefecture } from "@/hooks/usePrefecture";
import { RegisterForm } from "../../components/organism/registerForm";
import { type RegisterFormSchema, registerSchema } from "../../schemas/registerSchema";
import { colors } from "../../styles/colors";

const defaultScrollBottomPadding = 40;
const keyboardScrollMargin = 32;

function RegisterScreen() {
  const { register, isLoading, messageError } = useAuth();
  const { prefectures, isLoading: prefecturesLoading, error, loadPrefectures } = usePrefecture();
  const [scrollBottomPadding, setScrollBottomPadding] = useState(defaultScrollBottomPadding);

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      prefectureId: "",
      password: "",
    },
  });

  useEffect(() => {
    loadPrefectures();
  }, [loadPrefectures]);

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
          <LinearGradient
            colors={["#EEF7FA", "#FDFBF6", "#EAF8F5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: scrollBottomPadding,
                paddingHorizontal: 24,
                paddingTop: 24,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-1 px-1 pb-2 pt-1">
                <View className="mb-6 flex-row items-center gap-4">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.replace("/(auth)/login")}
                    className="h-11 w-11 items-center justify-center rounded-full bg-white"
                  >
                    <MaterialIcons name="arrow-back" size={24} color={colors.textDefault} />
                  </TouchableOpacity>

                  <View className="h-11 w-11 items-center justify-center rounded-full bg-[#0D6BEE]">
                    <MaterialIcons name="directions-bus" size={22} color="#FFFFFF" />
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="font-bold text-2xl text-[#051223]">Crie sua conta</Text>

                  <Text className="mt-2 text-base text-[#5E6A7A]">Leva menos de 1 minuto.</Text>
                </View>

                <RegisterForm
                  control={form.control}
                  prefectures={prefectures}
                  loading={isLoading}
                  error={messageError}
                  prefecturesLoading={prefecturesLoading}
                  prefecturesError={error}
                  onSubmit={form.handleSubmit(register)}
                />
              </View>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default RegisterScreen;
