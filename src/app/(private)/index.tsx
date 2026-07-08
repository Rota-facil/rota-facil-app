import { type Href, Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/useUser";
import { colors } from "@/presentation/shared/styles/colors";

const driverHomeRoute = "/(private)/driver/home" as Href;
const studentHomeRoute = "/(private)/students/home" as Href;

function PrivateIndex() {
  const { session, loading: isSessionLoading } = useSession();
  const { user, isLoading: isUserLoading, error, loadUser } = useUser();

  useEffect(() => {
    if (session) {
      loadUser();
    }
  }, [loadUser, session]);

  if (isSessionLoading || isUserLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7FBFC]">
        <ActivityIndicator size="large" color={colors.primaryGlow} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7FBFC] px-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2]">
          <Text className="font-bold text-[#DC2626] text-xl">!</Text>
        </View>

        <Text className="mt-4 text-center font-bold text-[#051223] text-xl">
          Nao foi possivel carregar sua conta
        </Text>

        <Text className="mt-2 text-center text-[#5E6A7A]">{error}</Text>

        <Pressable
          className="mt-6 rounded-full bg-[#0D6BEE] px-5 py-3 active:opacity-85"
          onPress={loadUser}
        >
          <Text className="font-semibold text-white">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role === "DRIVER") {
    return <Redirect href={driverHomeRoute} />;
  }

  return <Redirect href={studentHomeRoute} />;
}

export default PrivateIndex;
