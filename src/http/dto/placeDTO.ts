interface PlacePageDTO {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface PlaceListParamsDTO {
  page?: number;
  size?: number;
}

interface BoardPointResponseDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

interface BoardPointPageResponseDTO {
  content: BoardPointResponseDTO[];
  page: PlacePageDTO;
}

interface InstitutionResponseDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

interface InstitutionPageResponseDTO {
  content: InstitutionResponseDTO[];
  page: PlacePageDTO;
}

export type {
  BoardPointPageResponseDTO,
  BoardPointResponseDTO,
  InstitutionPageResponseDTO,
  InstitutionResponseDTO,
  PlaceListParamsDTO,
  PlacePageDTO,
};
