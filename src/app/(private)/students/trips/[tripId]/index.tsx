import { useLocalSearchParams } from "expo-router";
import StudentTripDetailsScreen from "@/presentation/student/screens/StudentTripDetailsScreen";

function StudentTripDetailsPage() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  return <StudentTripDetailsScreen tripId={tripId} />;
}

export default StudentTripDetailsPage;
