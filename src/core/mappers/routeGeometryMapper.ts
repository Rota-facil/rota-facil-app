import type { RouteCoordinateEntity, RouteGeometryEntity } from "@/core/entity/routeGeometryEntity";
import type { OsrmRouteDTO } from "@/http/dto/osrmRouteDTO";

const routeGeometryMapper = {
  toCoordinateEntity([longitude, latitude]: [number, number]): RouteCoordinateEntity {
    return {
      latitude,
      longitude,
    };
  },

  toEntity(dto: OsrmRouteDTO): RouteGeometryEntity | null {
    if (dto.geometry?.type !== "LineString") {
      return null;
    }

    const coordinates = dto.geometry.coordinates
      .map((coordinate) => this.toCoordinateEntity(coordinate))
      .filter(isValidRouteCoordinate);

    if (
      coordinates.length < 2 ||
      !Number.isFinite(dto.distance) ||
      !Number.isFinite(dto.duration)
    ) {
      return null;
    }

    return {
      coordinates,
      distanceInMeters: dto.distance,
      durationInSeconds: dto.duration,
    };
  },
};

function isValidRouteCoordinate(coordinate: RouteCoordinateEntity): boolean {
  return (
    Number.isFinite(coordinate.latitude) &&
    Number.isFinite(coordinate.longitude) &&
    coordinate.latitude >= -90 &&
    coordinate.latitude <= 90 &&
    coordinate.longitude >= -180 &&
    coordinate.longitude <= 180
  );
}

export { routeGeometryMapper };
