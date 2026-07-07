import type { PrefectureResponseDTO } from "../dto/prefectureDTO";
import { httpClient } from "../httpClient/httpClient";

const PrefectureRequest = {
  async getPrefectures(): Promise<PrefectureResponseDTO[]> {
    return httpClient.get<PrefectureResponseDTO[]>("/auth/prefectures");
  },

  async getPrefecture(prefectureId: string): Promise<PrefectureResponseDTO> {
    return httpClient.get<PrefectureResponseDTO>(`/auth/prefectures/${prefectureId}`);
  },

  async changeUserPrefecture(accessToken: string, prefectureId: string): Promise<void> {
    return httpClient.post<void>(`/auth/user/prefecture/${prefectureId}/change`, undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export { PrefectureRequest };
