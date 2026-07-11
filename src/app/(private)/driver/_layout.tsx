import { Tabs } from "expo-router";
import { DriverPrivateTabBar } from "@/presentation/driver/components/organisms/driverPrivateTabBar";

function DriverPrivateLayout() {
  return (
    <Tabs
      initialRouteName="home/index"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <DriverPrivateTabBar {...props} />}
    >
      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="trips/index" />
      <Tabs.Screen name="map/index" />
      <Tabs.Screen name="notifications/index" />
      <Tabs.Screen name="profile/index" />
      <Tabs.Screen name="trips/[tripId]/index" options={{ href: null }} />
      <Tabs.Screen name="profile/bus/index" options={{ href: null }} />
    </Tabs>
  );
}

export default DriverPrivateLayout;
