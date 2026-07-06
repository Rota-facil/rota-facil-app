import { Redirect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSession } from "@/hooks/useSession";
import OnboardingScreen from "../presentation/shared/screens/OverviewScreen";

const home: React.FC = () => {
  const { loading, session, firstAccess } = useSession();

  console.log("session", session);
  console.log("firstAccess", firstAccess);

  if (loading) {
    return null;
  }

  if (session) {
    return <Redirect href="/(private)/students/home" />;
  }

  if (!firstAccess) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaProvider>
      <OnboardingScreen />
    </SafeAreaProvider>
  );
};

export default home;
