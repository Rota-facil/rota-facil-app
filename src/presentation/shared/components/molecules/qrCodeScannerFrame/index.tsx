import { Text, View } from "react-native";

interface QrCodeScannerFrameProps {
  readonly helperText?: string;
}

function QrCodeScannerFrame({ helperText }: QrCodeScannerFrameProps) {
  return (
    <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
      <View className="h-56 w-56">
        <View className="absolute top-0 left-0 h-12 w-12 rounded-tl-3xl border-[#F5A524] border-t-4 border-l-4" />
        <View className="absolute top-0 right-0 h-12 w-12 rounded-tr-3xl border-[#F5A524] border-t-4 border-r-4" />
        <View className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-3xl border-[#F5A524] border-b-4 border-l-4" />
        <View className="absolute right-0 bottom-0 h-12 w-12 rounded-br-3xl border-[#F5A524] border-r-4 border-b-4" />
      </View>

      {helperText ? (
        <View className="mt-6 rounded-full bg-black/55 px-4 py-2">
          <Text className="text-center font-semibold text-sm text-white">{helperText}</Text>
        </View>
      ) : null}
    </View>
  );
}

export { QrCodeScannerFrame };
