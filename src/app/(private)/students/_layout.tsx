import { Tabs } from "expo-router";
import { StudentPrivateTabBar } from "@/presentation/student/components/organisms/studentPrivateTabBar";

function StudentPrivateLayout() {
  return (
    <Tabs
      initialRouteName="home/index"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <StudentPrivateTabBar {...props} />}
    >
      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="trips/index" />
      <Tabs.Screen name="map/index" />
      <Tabs.Screen name="notifications/index" />
      <Tabs.Screen name="profile/index" />
      <Tabs.Screen name="profile/edit/index" options={{ href: null }} />
      <Tabs.Screen name="profile/prefecture/index" options={{ href: null }} />
    </Tabs>
  );
}

export default StudentPrivateLayout;
