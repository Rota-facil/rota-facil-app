import type { RouteCoordinateEntity, RouteGeometryEntity } from "@/core/entity/routeGeometryEntity";
import { Mapper } from "@/core/mappers/mappers";
import { OsrmRouteRequest } from "@/http/request/osrmRouteRequest";

const RoutingService = {
  async calculateRoute(points: RouteCoordinateEntity[]): Promise<RouteGeometryEntity | null> {
    if (points.length < 2 || points.some((point) => !isValidRouteCoordinate(point))) {
      return null;
    }

    const dto = await OsrmRouteRequest.calculateRoute(points);

    if (dto.code !== "Ok") {
      return null;
    }

    const route = dto.routes?.[0];

    if (!route) {
      return null;
    }

    return Mapper.routeGeometry.toEntity(route);
  },
};

function isValidRouteCoordinate(point: RouteCoordinateEntity): boolean {
  return (
    Number.isFinite(point.latitude) &&
    Number.isFinite(point.longitude) &&
    point.latitude >= -90 &&
    point.latitude <= 90 &&
    point.longitude >= -180 &&
    point.longitude <= 180
  );
}

export { RoutingService };
