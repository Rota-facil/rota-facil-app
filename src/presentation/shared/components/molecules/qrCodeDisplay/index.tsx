import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors } from "@/presentation/shared/styles/colors";

interface QrCodeDisplayProps {
  readonly value: string;
  readonly title: string;
  readonly description?: string;
  readonly label?: string;
  readonly helperText?: string;
  readonly size?: number;
  readonly accessibilityLabel?: string;
}

function QrCodeDisplay({
  value,
  title,
  description,
  label,
  helperText,
  size = 220,
  accessibilityLabel,
}: QrCodeDisplayProps) {
  return (
    <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
        <MaterialIcons name="qr-code-2" size={28} color={colors.primaryGlow} />
      </View>

      <Text className="mt-5 font-bold text-2xl text-[#051223]">{title}</Text>

      {description ? <Text className="mt-2 text-[#5E6A7A] leading-5">{description}</Text> : null}

      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel ?? title}
        className="mt-6 items-center justify-center rounded-[28px] border border-[#E5EAF0] bg-white p-5"
      >
        {value.trim().length === 0 ? (
          <View className="h-[220px] w-[220px] items-center justify-center rounded-3xl bg-[#F8FAFC]">
            <MaterialIcons name="error-outline" size={34} color={colors.stateError} />
            <Text className="mt-3 text-center font-semibold text-[#5E6A7A]">
              QR Code indisponivel
            </Text>
          </View>
        ) : (
          <QRCode
            value={value}
            size={size}
            color="#051223"
            backgroundColor="#FFFFFF"
            quietZone={8}
            ecl="M"
          />
        )}
      </View>

      {label ? (
        <View className="mt-5 rounded-2xl bg-[#F8FAFC] p-4">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">Identificacao</Text>
          <Text className="mt-1 font-semibold text-sm text-[#051223]">{label}</Text>
        </View>
      ) : null}

      {helperText ? <Text className="mt-4 text-center text-[#5E6A7A]">{helperText}</Text> : null}
    </View>
  );
}

export { QrCodeDisplay };
