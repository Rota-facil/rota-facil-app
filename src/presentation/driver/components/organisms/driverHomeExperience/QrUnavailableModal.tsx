import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

function QrUnavailableModal({
  onClose,
  visible,
}: {
  readonly onClose: () => void;
  readonly visible: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/45">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="rounded-t-[28px] bg-white px-6 pb-8 pt-5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
            <MaterialIcons name="qr-code-2" size={27} color={colors.primaryGlow} />
          </View>
          <Text className="mt-5 font-bold text-[#051223] text-xl">QR Code indisponível</Text>
          <Text className="mt-2 text-[#5E6A7A] leading-6">
            O QR Code de check-in só fica disponível quando a viagem está em andamento e as regras
            atuais permitem essa ação.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            className="mt-5 h-12 items-center justify-center rounded-2xl bg-[#0D6BEE] active:opacity-85"
          >
            <Text className="font-bold text-white">Entendi</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export { QrUnavailableModal };
