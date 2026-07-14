import { View } from "react-native";
import type { TripEntity, TripPresence } from "@/core/entity/tripEntity";
import { StudentHomeHeader } from "./StudentHomeHeader";
import { StudentNoTripContext } from "./StudentNoTripContext";
import { StudentTripContext } from "./StudentTripContext";

interface StudentHomeExperienceProps {
  readonly isPresenceLoading: boolean;
  readonly onOpenCheckIn: () => void;
  readonly onOpenMap: () => void;
  readonly onOpenTripDetails: () => void;
  readonly onOpenTrips: () => void;
  readonly studentPresence: TripPresence | null;
  readonly trip: TripEntity | null;
}

function StudentHomeExperience({
  isPresenceLoading,
  onOpenCheckIn,
  onOpenMap,
  onOpenTripDetails,
  onOpenTrips,
  studentPresence,
  trip,
}: StudentHomeExperienceProps) {
  return (
    <View>
      {trip ? (
        <StudentTripContext
          isPresenceLoading={isPresenceLoading}
          onOpenCheckIn={onOpenCheckIn}
          onOpenMap={onOpenMap}
          onOpenTripDetails={onOpenTripDetails}
          studentPresence={studentPresence}
          trip={trip}
        />
      ) : (
        <StudentNoTripContext onOpenTrips={onOpenTrips} />
      )}
    </View>
  );
}

export { StudentHomeExperience, StudentHomeHeader };
