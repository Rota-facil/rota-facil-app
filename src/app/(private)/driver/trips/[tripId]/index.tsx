import { useLocalSearchParams } from "expo-router";
import { TripDetailsPlaceholderScreen } from "@/presentation/shared/screens/TripDetailsPlaceholderScreen";

function DriverTripDetailsPage() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  return <TripDetailsPlaceholderScreen tripId={tripId} context="driver" />;
}

export default DriverTripDetailsPage;
