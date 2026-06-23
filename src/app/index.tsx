import { CirclePlus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useStorage } from "../hooks/useStorage";
import OnboardingScreen from "../presentation/shared/screens/OverviewScreen";

const home: React.FC = () => {
  const { token, firstAccess, isLoading, error } = useStorage();

  if (isLoading) {
    // screen loading
  }

  if (token) {
    // return <Redirect href="/home" />;
  }

  if (!firstAccess && firstAccess !== null) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaProvider>
      <OnboardingScreen />
    </SafeAreaProvider>
  );
};

export default home;
