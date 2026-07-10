import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { QR_CODE_TYPES } from "@/core/entity/qrCodeEntity";
import { ActionCard } from "@/presentation/shared/components/molecules/actionCard";
import { CurrentTripCard } from "@/presentation/shared/components/molecules/currentTripCard";
import { GreetingCard } from "@/presentation/shared/components/molecules/greetingCard";
import { NotificationCard } from "@/presentation/shared/components/molecules/notificationCard";
import { studentHomeMock } from "@/presentation/shared/data/studentHome";
import { colors } from "@/presentation/shared/styles/colors";
import { StatusAlertCard } from "../../components/molecules/statusAlertCard";

export default function StudentHomeScreen() {
  const router = useRouter();
  const data = studentHomeMock;

  const handleActionPress = (actionId: string) => {
    if (actionId === "check-in") {
      router.push({
        pathname: "/(private)/qr-code/scan",
        params: {
          description: "Aponte a camera para o QR Code apresentado pelo motorista.",
          expectedType: QR_CODE_TYPES.TRIP_CHECK_IN,
          successDescription:
            "O QR Code da viagem foi validado. A confirmacao sera conectada ao fluxo de check-in.",
          successTitle: "QR Code da viagem validado",
          title: "Escanear QR Code",
        },
      });
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <GreetingCard
        greeting={data.user.greeting}
        userName={data.user.name}
        organization={data.user.organization}
        unreadNotifications={data.user.unreadNotifications}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <CurrentTripCard
          trip={data.currentTrip}
          onTripPress={() => console.log("Current trip pressed")}
        />

        <View className="mt-4 flex-row gap-3 py-3">
          {data.actions.map((action) => (
            <View key={action.id} className="flex-1">
              <ActionCard
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                variant={action.variant}
                onPress={() => handleActionPress(action.id)}
              />
            </View>
          ))}
        </View>

        <View className="mt-6">
          <StatusAlertCard
            statusAlert={data.statusAlert}
            onPress={() => {
              console.log("Status alert pressed");
            }}
          />
        </View>

        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-bold" style={{ color: colors.textDefault }}>
              Últimos avisos
            </Text>

            <Text className="text-xs font-bold" style={{ color: colors.primaryGlow }}>
              Ver todos
            </Text>
          </View>

          <View className="gap-2">
            {data.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                title={notification.title}
                description={notification.description}
                time={notification.time}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
