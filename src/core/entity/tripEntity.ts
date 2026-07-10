type TripDelay = "LATE" | "PUNCTUAL" | "EARLY";
type TripProgress =
  | "NOT_STARTED"
  | "CANCELLED"
  | "STARTED"
  | "STARTED_FINISHED"
  | "RETURN_STARTED"
  | "RETURN_FINISHED"
  | "INSTITUTION_ARRIVAL"
  | "BOARD_POINT_ARRIVAL";
type TripPresence = "CHECKIN" | "PENDING" | "ABSENT";
type TripShift = "MORNING" | "AFTERNOON" | "NIGHT";

interface JoinTripPayload {
  readonly boardPointId: string;
  readonly institutionId: string;
  readonly going: boolean;
  readonly returning: boolean;
}

interface CancelTripPayload {
  readonly reasonOfCancellation: string;
}

interface ProcessTripPositionPayload {
  readonly tripId: string;
  readonly latitude: number;
  readonly longitude: number;
}

interface TripUserUserEntity {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

interface TripLocationEntity {
  readonly id: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

interface TripUserEntity {
  readonly id: string;
  readonly user: TripUserUserEntity;
  readonly institution: TripLocationEntity;
  readonly boardPoint: TripLocationEntity;
  readonly presence: TripPresence;
  readonly going: boolean;
  readonly returning: boolean;
}

interface SimpleTripUserEntity {
  readonly id: string;
  readonly user: TripUserUserEntity;
  readonly institutionName: string;
  readonly boardPointName: string;
  readonly presence: TripPresence;
  readonly score: number;
  readonly going: boolean;
  readonly returning: boolean;
}

interface TripDriverEntity {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

interface TripBusEntity {
  readonly id: string;
  readonly driver: TripDriverEntity;
  readonly prefectureId: string;
  readonly capacity: number;
  readonly plate: string;
}

type TripRouteInstitutionEntity = TripLocationEntity;
type TripRouteBoardPointEntity = TripLocationEntity;

interface TripRouteEntity {
  readonly id: string;
  readonly name: string;
  readonly shift: TripShift;
  readonly going: string;
  readonly returning: string;
  readonly goingFinish: string;
  readonly returnFinish: string;
  readonly institutions: TripRouteInstitutionEntity[];
  readonly boardPoints: TripRouteBoardPointEntity[];
}

interface TripStatusEntity {
  readonly id: string;
  readonly progress: TripProgress;
  readonly delay: TripDelay;
  readonly description: string;
  readonly createdAt: string;
}

interface TripEntity {
  readonly id: string;
  readonly name: string;
  readonly reasonOfCancellation: string | null;
  readonly students: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly createdAt: string;
  readonly bus: TripBusEntity;
  readonly route: TripRouteEntity;
  readonly actualStatus: string;
  readonly tripStatus: TripStatusEntity[];
}

interface TripPageEntity {
  readonly size: number;
  readonly number: number;
  readonly totalElements: number;
  readonly totalPages: number;
}

interface TripPageResultEntity {
  readonly content: TripEntity[];
  readonly page: TripPageEntity;
}

interface TripListParams {
  readonly page?: number;
  readonly size?: number;
}

export type {
  CancelTripPayload,
  JoinTripPayload,
  ProcessTripPositionPayload,
  SimpleTripUserEntity,
  TripBusEntity,
  TripDelay,
  TripDriverEntity,
  TripEntity,
  TripListParams,
  TripLocationEntity,
  TripPageEntity,
  TripPageResultEntity,
  TripPresence,
  TripProgress,
  TripRouteBoardPointEntity,
  TripRouteEntity,
  TripRouteInstitutionEntity,
  TripShift,
  TripStatusEntity,
  TripUserEntity,
  TripUserUserEntity,
};
