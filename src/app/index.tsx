import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const home: React.FC = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>Hello world</Text>
    </SafeAreaView>
  );
};

export default home;
