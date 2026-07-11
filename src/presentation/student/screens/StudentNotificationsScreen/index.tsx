import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StudentNotifications } from "@/presentation/student/components/organisms/studentNotifications";

function StudentNotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 bg-[#F7FBFC]">
        <StudentNotifications />
      </View>
    </SafeAreaView>
  );
}

export default StudentNotificationsScreen;
