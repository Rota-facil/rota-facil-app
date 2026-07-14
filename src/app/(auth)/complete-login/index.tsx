import { useLocalSearchParams } from "expo-router";
import GoogleCompleteRegistrationScreen from "@/presentation/shared/screens/GoogleCompleteRegistrationScreen";

function getPendingTokenParam(value: string | string[] | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const pendingToken = value.trim();

  return pendingToken.length > 0 ? pendingToken : null;
}

export default function GoogleCompleteLoginPage() {
  const { pendingToken } = useLocalSearchParams<{
    pendingToken?: string | string[];
  }>();

  return <GoogleCompleteRegistrationScreen pendingToken={getPendingTokenParam(pendingToken)} />;
}
