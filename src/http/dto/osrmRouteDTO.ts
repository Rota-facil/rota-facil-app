interface OsrmRouteGeometryDTO {
  readonly type: "LineString";
  readonly coordinates: [number, number][];
}

interface OsrmRouteDTO {
  readonly distance: number;
  readonly duration: number;
  readonly geometry?: OsrmRouteGeometryDTO;
}

interface OsrmRouteResponseDTO {
  readonly code: string;
  readonly message?: string;
  readonly routes?: OsrmRouteDTO[];
}

export type { OsrmRouteDTO, OsrmRouteGeometryDTO, OsrmRouteResponseDTO };
