import { useLocalSearchParams } from "expo-router";
import DriverTripDetailsScreen from "@/presentation/driver/screens/DriverTripDetailsScreen";

function DriverTripDetailsPage() {
  const { openQrCode, tripId } = useLocalSearchParams<{
    openQrCode?: string;
    tripId: string;
  }>();

  return <DriverTripDetailsScreen tripId={tripId} shouldOpenQrCode={openQrCode === "1"} />;
}

export default DriverTripDetailsPage;
