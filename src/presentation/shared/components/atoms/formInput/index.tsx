import { type Control, Controller, type FieldValues, get, type Path } from "react-hook-form";
import { Text, View } from "react-native";
import { BaseInput } from "../baseInput";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  label: string;
  leftIcon?: React.ReactNode;
}

function FormInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  leftIcon,
}: FormInputProps<T>) {
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
              value={field.value}
              onChangeText={field.onChange}
              placeholder={placeholder}
              leftIcon={leftIcon}
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

export { FormInput };
