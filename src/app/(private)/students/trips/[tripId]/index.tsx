import { useLocalSearchParams } from "expo-router";
import { TripDetailsPlaceholderScreen } from "@/presentation/shared/screens/TripDetailsPlaceholderScreen";

function StudentTripDetailsPage() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  return <TripDetailsPlaceholderScreen tripId={tripId} context="student" />;
}

export default StudentTripDetailsPage;
