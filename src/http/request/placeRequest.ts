import type {
  BoardPointPageResponseDTO,
  InstitutionPageResponseDTO,
  PlaceListParamsDTO,
} from "../dto/placeDTO";
import { httpClient } from "../httpClient/httpClient";

function buildPlaceListPath(path: string, params?: PlaceListParamsDTO): string {
  if (!params) {
    return path;
  }

  const queryParams = [
    params.page === undefined ? null : `page=${encodeURIComponent(params.page)}`,
    params.size === undefined ? null : `size=${encodeURIComponent(params.size)}`,
  ].filter((param) => param !== null);

  if (queryParams.length === 0) {
    return path;
  }

  return `${path}?${queryParams.join("&")}`;
}

const PlaceRequest = {
  async getInstitutions(
    accessToken: string,
    params?: PlaceListParamsDTO,
  ): Promise<InstitutionPageResponseDTO> {
    return httpClient.get<InstitutionPageResponseDTO>(
      buildPlaceListPath("/places/institutions", params),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  },

  async getBoardPoints(
    accessToken: string,
    params?: PlaceListParamsDTO,
  ): Promise<BoardPointPageResponseDTO> {
    return httpClient.get<BoardPointPageResponseDTO>(
      buildPlaceListPath("/places/board-points", params),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  },
};

export { PlaceRequest };
