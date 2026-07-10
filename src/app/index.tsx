import { type Href, Redirect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSession } from "@/hooks/useSession";
import OnboardingScreen from "../presentation/shared/screens/OverviewScreen";

const privateRoute = "/(private)" as Href;

const home: React.FC = () => {
  const { loading, session, firstAccess } = useSession();

  if (loading) {
    return null;
  }

  if (session) {
    return <Redirect href={privateRoute} />;
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
