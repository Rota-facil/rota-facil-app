import { Stack } from "expo-router";
import "./global.css";
import { SessionProvider } from "@/context/provider/sessionProvider";
import "@/core/service/locationTrackingTask";

const Layout: React.FC = () => {
  return (
    <SessionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </SessionProvider>
  );
};

export default Layout;
