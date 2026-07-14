import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { useKeyboardVisible } from "@/presentation/shared/hooks/useKeyboardVisible";
import { colors } from "@/presentation/shared/styles/colors";
import { MODAL_BOTTOM_SAFE_PADDING } from "@/presentation/shared/styles/layout";

interface DestructiveConfirmationProps {
  visible: boolean;
  title: string;
  description: string;
  confirmationText: string;
  actionLabel: string;
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

function DestructiveConfirmation({
  visible,
  title,
  description,
  confirmationText,
  actionLabel,
  loading = false,
  error,
  onCancel,
  onConfirm,
}: DestructiveConfirmationProps) {
  const insets = useSafeAreaInsets();
  const isKeyboardVisible = useKeyboardVisible();
  const [typedConfirmation, setTypedConfirmation] = useState("");

  const isConfirmationValid = useMemo(
    () => typedConfirmation.trim() === confirmationText,
    [confirmationText, typedConfirmation],
  );

  const handleCancel = () => {
    if (loading) {
      return;
    }

    setTypedConfirmation("");
    onCancel();
  };

  const handleConfirm = () => {
    if (!isConfirmationValid || loading) {
      return;
    }

    onConfirm();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        enabled={isKeyboardVisible}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-end bg-black/45">
          <Pressable className="flex-1" onPress={handleCancel} />

          <ScrollView
            className="max-h-[92%] rounded-t-[28px] bg-white px-6 pt-5"
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom, MODAL_BOTTOM_SAFE_PADDING),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-5 flex-row items-start justify-between">
              <View className="mr-4 flex-1">
                <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2]">
                  <MaterialIcons name="warning-amber" size={26} color={colors.stateError} />
                </View>

                <Text className="font-bold text-[#051223] text-xl">{title}</Text>

                <Text className="mt-2 text-[#5E6A7A] text-sm leading-5">{description}</Text>
              </View>

              <Pressable
                disabled={loading}
                onPress={handleCancel}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]"
              >
                <MaterialIcons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>

            <View className="rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] p-4">
              <Text className="font-semibold text-[#991B1B] text-sm">
                Esta ação não deve ser executada acidentalmente.
              </Text>

              <Text className="mt-2 text-[#7F1D1D] text-sm leading-5">
                Digite <Text className="font-bold">{confirmationText}</Text> para liberar a ação
                destrutiva.
              </Text>
            </View>

            <TextInput
              editable={!loading}
              value={typedConfirmation}
              onChangeText={setTypedConfirmation}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={confirmationText}
              className="mt-4 h-14 rounded-2xl border border-[#E5EAF0] bg-white px-4 text-[#051223]"
            />

            {error && <Text className="mt-3 text-[#DC2626] text-sm">{error}</Text>}

            <View className="mt-5 gap-3">
              <SystemButton
                title={actionLabel}
                variant="danger"
                loading={loading}
                disabled={!isConfirmationValid}
                onPress={handleConfirm}
                hideIcon
              />

              <SystemButton
                title="Cancelar"
                variant="white"
                disabled={loading}
                onPress={handleCancel}
                hideIcon
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export { DestructiveConfirmation };
