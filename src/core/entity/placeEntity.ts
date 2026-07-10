interface PlacePageEntity {
  readonly size: number;
  readonly number: number;
  readonly totalElements: number;
  readonly totalPages: number;
}

interface PlaceListParams {
  readonly page?: number;
  readonly size?: number;
}

interface BoardPointEntity {
  readonly id: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly createdAt: string;
}

interface BoardPointPageResultEntity {
  readonly content: BoardPointEntity[];
  readonly page: PlacePageEntity;
}

interface InstitutionEntity {
  readonly id: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly createdAt: string;
}

interface InstitutionPageResultEntity {
  readonly content: InstitutionEntity[];
  readonly page: PlacePageEntity;
}

export type {
  BoardPointEntity,
  BoardPointPageResultEntity,
  InstitutionEntity,
  InstitutionPageResultEntity,
  PlaceListParams,
  PlacePageEntity,
};
