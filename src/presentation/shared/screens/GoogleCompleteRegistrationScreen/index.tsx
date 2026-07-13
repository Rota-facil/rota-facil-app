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
import { CpfInput } from "@/presentation/shared/components/atoms/cpfInput";
import { PrefectureSelect } from "@/presentation/shared/components/atoms/prefectureSelect";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { FormErrorMessage } from "@/presentation/shared/components/molecules/formErrorMessage";
import {
  type GoogleCompleteRegistrationFormSchema,
  googleCompleteRegistrationSchema,
} from "@/presentation/shared/schemas/googleCompleteRegistrationSchema";
import { colors } from "@/presentation/shared/styles/colors";

interface GoogleCompleteRegistrationScreenProps {
  readonly pendingToken: string | null;
}

const defaultScrollBottomPadding = 40;
const keyboardScrollMargin = 32;

function GoogleCompleteRegistrationScreen({ pendingToken }: GoogleCompleteRegistrationScreenProps) {
  const { completeGoogleRegistration, isLoading, messageError } = useAuth();
  const { prefectures, isLoading: prefecturesLoading, error, loadPrefectures } = usePrefecture();
  const [scrollBottomPadding, setScrollBottomPadding] = useState(defaultScrollBottomPadding);

  const form = useForm<GoogleCompleteRegistrationFormSchema>({
    resolver: zodResolver(googleCompleteRegistrationSchema),
    defaultValues: {
      cpf: "",
      prefectureId: "",
    },
  });

  useEffect(() => {
    if (pendingToken) {
      void loadPrefectures();
    }
  }, [loadPrefectures, pendingToken]);

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

  const handleSubmit = async (values: GoogleCompleteRegistrationFormSchema) => {
    if (!pendingToken || isLoading) {
      return;
    }

    await completeGoogleRegistration(pendingToken, {
      cpf: values.cpf,
      prefectureId: values.prefectureId,
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
          className="flex-1"
        >
          <LinearGradient
            colors={["#EEF7FA", "#FDFBF6", "#EAF3FF"]}
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
                    <MaterialIcons name="verified-user" size={22} color="#FFFFFF" />
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="font-bold text-2xl text-[#051223]">Complete seu cadastro</Text>

                  <Text className="mt-2 text-base text-[#5E6A7A] leading-6">
                    Informe CPF e prefeitura para vincular seu acesso ao transporte escolar
                    municipal.
                  </Text>
                </View>

                {pendingToken ? (
                  <View className="gap-5">
                    <CpfInput
                      control={form.control}
                      name="cpf"
                      label="CPF"
                      placeholder="000.000.000-00"
                      disabled={isLoading}
                    />

                    <PrefectureSelect
                      control={form.control}
                      name="prefectureId"
                      label="PREFEITURA *"
                      placeholder="Selecione sua prefeitura"
                      prefectures={prefectures}
                      loading={prefecturesLoading}
                      disabled={isLoading}
                      error={error}
                    />

                    {error ? (
                      <TouchableOpacity
                        activeOpacity={0.82}
                        disabled={prefecturesLoading || isLoading}
                        onPress={() => void loadPrefectures()}
                        className="self-start rounded-full bg-white px-4 py-2"
                      >
                        <Text className="font-semibold text-[#0D6BEE] text-sm">
                          Tentar carregar novamente
                        </Text>
                      </TouchableOpacity>
                    ) : null}

                    <FormErrorMessage message={messageError} />

                    <View className="mt-1">
                      <SystemButton
                        title="Concluir cadastro"
                        iconLeft="check"
                        loading={isLoading}
                        disabled={prefecturesLoading}
                        onPress={form.handleSubmit(handleSubmit)}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF2F2]">
                      <MaterialIcons name="error-outline" size={27} color={colors.stateError} />
                    </View>

                    <Text className="mt-5 font-bold text-xl text-[#051223]">
                      Link de cadastro inválido
                    </Text>

                    <Text className="mt-2 text-[#5E6A7A] leading-5">
                      Inicie o login com Google novamente para concluir seu cadastro.
                    </Text>

                    <View className="mt-6">
                      <SystemButton
                        title="Voltar ao login"
                        iconLeft="arrow-back"
                        onPress={() => router.replace("/(auth)/login")}
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default GoogleCompleteRegistrationScreen;
