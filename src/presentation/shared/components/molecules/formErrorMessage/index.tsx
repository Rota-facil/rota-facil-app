import { Text } from "react-native";

interface FormErrorMessageProps {
  message?: string | null;
}

function FormErrorMessage({ message }: FormErrorMessageProps) {
  if (!message) {
    return null;
  }

  return <Text className="mt-2 text-[#DC2626] text-sm">{message}</Text>;
}

export { FormErrorMessage };
