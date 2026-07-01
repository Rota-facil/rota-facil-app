import { Redirect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSession } from "@/hooks/useSession";
import OnboardingScreen from "../presentation/shared/screens/OverviewScreen";

const home: React.FC = () => {
  const { loading, session, firstAccess } = useSession();

  if (loading) {
    // screen loading
  }

  if (session) {
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
