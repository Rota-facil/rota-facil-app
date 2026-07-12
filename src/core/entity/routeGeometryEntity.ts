interface RouteCoordinateEntity {
  readonly latitude: number;
  readonly longitude: number;
}

interface RouteGeometryEntity {
  readonly coordinates: RouteCoordinateEntity[];
  readonly distanceInMeters: number;
  readonly durationInSeconds: number;
}

export type { RouteCoordinateEntity, RouteGeometryEntity };
