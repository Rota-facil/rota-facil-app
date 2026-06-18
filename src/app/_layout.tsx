import { Stack } from "expo-router";
import "./global.css";

const Layout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default Layout;
