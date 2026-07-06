import type { PrefectureResponseDTO } from "../dto/prefectureDTO";
import { httpClient } from "../httpClient/httpClient";

const PrefectureRequest = {
  async getPrefectures(accessToken: string): Promise<PrefectureResponseDTO[]> {
    console.log("getPrefectures", accessToken);
    return httpClient.get<PrefectureResponseDTO[]>("/auth/prefectures", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async getPrefecture(accessToken: string, prefectureId: string): Promise<PrefectureResponseDTO> {
    console.log("getPrefecture", accessToken, prefectureId);
    return httpClient.get<PrefectureResponseDTO>(`/auth/prefectures/${prefectureId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export { PrefectureRequest };
