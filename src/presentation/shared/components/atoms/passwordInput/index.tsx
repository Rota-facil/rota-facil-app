import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { type Control, Controller, type FieldValues, get, type Path } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/presentation/shared/styles/colors";
import { BaseInput } from "../baseInput";

interface PasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
}

function PasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState: { errors } }) => {
        const error = get(errors, name);
        return (
          <View>
            <Text className="mb-2 text-sm font-semibold text-[#5E6A7A]">{label}</Text>

            <BaseInput
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry={!showPassword}
              placeholder={placeholder}
              leftIcon={<MaterialIcons name="lock-outline" size={20} color={colors.muted} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              }
            />

            {error?.message && (
              <Text className={"text-[#DC2626] text-sm mt-2"}>{String(error.message)}</Text>
            )}
          </View>
        );
      }}
    />
  );
}

export { PasswordInput };
