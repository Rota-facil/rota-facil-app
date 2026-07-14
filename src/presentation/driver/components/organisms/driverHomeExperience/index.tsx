import { View } from "react-native";
import type { SimpleTripUserEntity, TripEntity } from "@/core/entity/tripEntity";
import { DriverHomeHeader } from "./DriverHomeHeader";
import { DriverNoTripContext } from "./DriverNoTripContext";
import { DriverTripContext } from "./DriverTripContext";

interface DriverHomeExperienceProps {
  readonly actionError: string | null;
  readonly canOpenNavigation: boolean;
  readonly canShowCheckInQrCode: boolean;
  readonly canStartTrip: boolean;
  readonly isActionLoading: boolean;
  readonly onOpenDetails: () => void;
  readonly onOpenNavigation: () => void;
  readonly onOpenQrCode: () => void;
  readonly onOpenTrips: () => void;
  readonly onStartTrip: () => void;
  readonly students: SimpleTripUserEntity[];
  readonly trip: TripEntity | null;
}

function DriverHomeExperience({
  actionError,
  canOpenNavigation,
  canShowCheckInQrCode,
  canStartTrip,
  isActionLoading,
  onOpenDetails,
  onOpenNavigation,
  onOpenQrCode,
  onOpenTrips,
  onStartTrip,
  students,
  trip,
}: DriverHomeExperienceProps) {
  return (
    <View>
      {trip ? (
        <DriverTripContext
          actionError={actionError}
          canOpenNavigation={canOpenNavigation}
          canShowCheckInQrCode={canShowCheckInQrCode}
          canStartTrip={canStartTrip}
          isActionLoading={isActionLoading}
          onOpenDetails={onOpenDetails}
          onOpenNavigation={onOpenNavigation}
          onOpenQrCode={onOpenQrCode}
          onStartTrip={onStartTrip}
          students={students}
          trip={trip}
        />
      ) : (
        <DriverNoTripContext onOpenTrips={onOpenTrips} />
      )}
    </View>
  );
}

export { DriverHomeExperience, DriverHomeHeader };
