type DriverStatusDTO = "ON_ROUTE" | "AVAILABLE";
type DriverBusStatusDTO = "OPERATION" | "OUT_OF_OPERATION";

interface DriverBusResponseDTO {
  id: string;
  prefectureId: string;
  capacity: number;
  plate: string;
  status: DriverBusStatusDTO;
}

interface DriverResponseDTO {
  id: string;
  prefectureId: string;
  name: string;
  email: string;
  cpf: string;
  score: number;
  active: boolean;
  bus: DriverBusResponseDTO;
  completedTrips: number;
  trips: number;
  status: DriverStatusDTO;
  role: "DRIVER";
}

export type { DriverBusResponseDTO, DriverBusStatusDTO, DriverResponseDTO, DriverStatusDTO };
