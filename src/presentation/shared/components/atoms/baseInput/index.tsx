import type { ReactNode } from "react";
import { TextInput, type TextInputProps, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";

interface BaseInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  secureTextEntry?: boolean;
}

function BaseInput({ leftIcon, rightIcon, ...props }: BaseInputProps) {
  return (
    <View
      className="h-14 rounded-2xl border flex-row items-center px-4"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      {leftIcon}

      <TextInput className="flex-1 ml-3" {...props} />

      {rightIcon}
    </View>
  );
}

export { BaseInput };
