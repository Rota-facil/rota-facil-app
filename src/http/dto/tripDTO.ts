type TripDelayDTO = "LATE" | "PUNCTUAL" | "EARLY";
type TripProgressDTO =
  | "NOT_STARTED"
  | "CANCELLED"
  | "STARTED"
  | "STARTED_FINISHED"
  | "RETURN_STARTED"
  | "RETURN_FINISHED"
  | "INSTITUTION_ARRIVAL"
  | "BOARD_POINT_ARRIVAL";
type TripPresenceDTO = "CHECKIN" | "PENDING" | "ABSENT";
type TripShiftDTO = "MORNING" | "AFTERNOON" | "NIGHT";

interface JoinUserInTripRequestDTO {
  boardPointId: string;
  institutionId: string;
  going: boolean;
  return_: boolean;
}

interface CancelTripRequestDTO {
  reasonOfCancellation: string;
}

interface ProcessTripPositionParamsDTO {
  tripId: string;
  latitude: number;
  longitude: number;
}

interface TripUserUserResponseDTO {
  id: string;
  name: string;
  email: string;
}

interface TripUserInstitutionResponseDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface TripUserBoardPointResponseDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface TripUserResponseDTO {
  id: string;
  user: TripUserUserResponseDTO;
  institution: TripUserInstitutionResponseDTO;
  boardPoint: TripUserBoardPointResponseDTO;
  presence: TripPresenceDTO;
  going: boolean;
  return_: boolean;
}

interface SimpleTripUserResponseDTO {
  id: string;
  user: TripUserUserResponseDTO;
  institutionName: string;
  boardPointName: string;
  presence: TripPresenceDTO;
  score: number;
  going: boolean;
  return_: boolean;
}

interface TripDriverResponseDTO {
  id: string;
  name: string;
  email: string;
}

interface TripBusResponseDTO {
  id: string;
  driver: TripDriverResponseDTO;
  prefectureId: string;
  capacity: number;
  plate: string;
}

interface TripRouteInstitutionResponseDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface TripRouteBoardPointResponseDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface TripRouteResponseDTO {
  id: string;
  name: string;
  shift: TripShiftDTO;
  going: string;
  return_: string;
  goingFinish: string;
  returnFinish: string;
  institutions: TripRouteInstitutionResponseDTO[];
  boardPoints: TripRouteBoardPointResponseDTO[];
}

interface TripStatusResponseDTO {
  id: string;
  progress: TripProgressDTO;
  delay: TripDelayDTO;
  description: string;
  createdAt: string;
}

interface TripResponseDTO {
  id: string;
  name: string;
  reasonOfCancellation: string | null;
  students: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  bus: TripBusResponseDTO;
  route: TripRouteResponseDTO;
  actualStatus: string;
  tripStatus: TripStatusResponseDTO[];
}

interface TripPageDTO {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface TripPageResponseDTO {
  content: TripResponseDTO[];
  page: TripPageDTO;
}

interface TripListParamsDTO {
  page?: number;
  size?: number;
}

export type {
  CancelTripRequestDTO,
  JoinUserInTripRequestDTO,
  ProcessTripPositionParamsDTO,
  SimpleTripUserResponseDTO,
  TripBusResponseDTO,
  TripDelayDTO,
  TripDriverResponseDTO,
  TripListParamsDTO,
  TripPageDTO,
  TripPageResponseDTO,
  TripPresenceDTO,
  TripProgressDTO,
  TripResponseDTO,
  TripRouteBoardPointResponseDTO,
  TripRouteInstitutionResponseDTO,
  TripRouteResponseDTO,
  TripShiftDTO,
  TripStatusResponseDTO,
  TripUserBoardPointResponseDTO,
  TripUserInstitutionResponseDTO,
  TripUserResponseDTO,
  TripUserUserResponseDTO,
};
