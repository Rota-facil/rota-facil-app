import { MaterialIcons } from "@expo/vector-icons";
import { type Control, Controller, type FieldValues, get, type Path } from "react-hook-form";
import { Text, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import { formatCpf, onlyCpfDigits } from "@/presentation/shared/utils/cpf";
import { BaseInput } from "../baseInput";

interface CpfInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  disabled?: boolean;
}

function CpfInput<T extends FieldValues>({
  control,
  disabled = false,
  name,
  label,
  placeholder,
}: CpfInputProps<T>) {
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
              editable={!disabled}
              value={formatCpf(String(field.value ?? ""))}
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
