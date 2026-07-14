import { HttpClientError, HttpServerError } from "@/errors/errors";
import type { OsrmRouteResponseDTO } from "@/http/dto/osrmRouteDTO";
import { config } from "@/http/httpClient/config";

interface OsrmRoutePointParams {
  readonly latitude: number;
  readonly longitude: number;
}

const routeRequestTimeoutMs = 8_000;

function buildRoutePath(points: OsrmRoutePointParams[]): string {
  const coordinates = points
    .map((point) => `${encodeURIComponent(point.longitude)},${encodeURIComponent(point.latitude)}`)
    .join(";");

  return `/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
}

function buildRouteUrl(points: OsrmRoutePointParams[]): string {
  return `${config.osrmBaseUrl.replace(/\/$/, "")}${buildRoutePath(points)}`;
}

const OsrmRouteRequest = {
  async calculateRoute(points: OsrmRoutePointParams[]): Promise<OsrmRouteResponseDTO> {
    let response: Response;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, routeRequestTimeoutMs);

    try {
      response = await fetch(buildRouteUrl(points), {
        signal: abortController.signal,
      });
    } catch {
      throw new HttpClientError("Falha ao conectar com o serviço de roteamento.");
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new HttpServerError(`Falha ao calcular rota (${response.status}).`, response.status);
    }

    try {
      return (await response.json()) as OsrmRouteResponseDTO;
    } catch {
      throw new HttpClientError("Falha ao processar resposta do serviço de roteamento.");
    }
  },
};

export type { OsrmRoutePointParams };
export { OsrmRouteRequest };
