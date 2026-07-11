type BusStatusDTO = string;
type BusDriverRoleDTO = "STUDENT" | "DRIVER";

interface BusDriverResponseDTO {
  id: string;
  name: string;
  email: string;
  role: BusDriverRoleDTO;
}

interface BusResponseDTO {
  id: string;
  prefectureId: string;
  capacity: number;
  plate: string;
  createdAt: string;
  driver: BusDriverResponseDTO;
  status: BusStatusDTO;
}

export type { BusDriverResponseDTO, BusResponseDTO, BusStatusDTO };
