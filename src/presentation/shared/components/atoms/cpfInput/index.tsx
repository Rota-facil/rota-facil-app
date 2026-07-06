import { MaterialIcons } from "@expo/vector-icons";
import { type Control, Controller, get } from "react-hook-form";
import { Text, View } from "react-native";
import type { RegisterFormSchema } from "@/presentation/shared/schemas/registerSchema";
import { colors } from "@/presentation/shared/styles/colors";
import { formatCpf, onlyCpfDigits } from "@/presentation/shared/utils/cpf";
import { BaseInput } from "../baseInput";

interface CpfInputProps {
  control: Control<RegisterFormSchema>;
  name: "cpf";
  label: string;
  placeholder: string;
}

function CpfInput({ control, name, label, placeholder }: CpfInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => {
        const error = get(formState.errors, name);

        return (
          <View>
            <Text className="mb-2 text-sm font-semibold text-[#5E6A7A]">{label}</Text>

            <BaseInput
              value={formatCpf(field.value)}
              onChangeText={(value) => field.onChange(onlyCpfDigits(value))}
              placeholder={placeholder}
              keyboardType="number-pad"
              maxLength={14}
              leftIcon={<MaterialIcons name="badge" size={20} color={colors.muted} />}
            />

            {error?.message && (
              <Text className="mt-2 text-sm text-[#DC2626]">{String(error.message)}</Text>
            )}
          </View>
        );
      }}
    />
  );
}

export { CpfInput };
