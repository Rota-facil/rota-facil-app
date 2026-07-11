import { useLocalSearchParams } from "expo-router";
import DriverTripDetailsScreen from "@/presentation/driver/screens/DriverTripDetailsScreen";

function DriverTripDetailsPage() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  return <DriverTripDetailsScreen tripId={tripId} />;
}

export default DriverTripDetailsPage;
