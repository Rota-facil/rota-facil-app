import type { PrefectureResponseDTO } from "../dto/prefectureDTO";
import { httpClient } from "../httpClient/httpClient";

const PrefectureRequest = {
  async getPrefectures(): Promise<PrefectureResponseDTO[]> {
    return httpClient.get<PrefectureResponseDTO[]>("/auth/prefectures");
  },

  async getPrefecture(prefectureId: string): Promise<PrefectureResponseDTO> {
    return httpClient.get<PrefectureResponseDTO>(`/auth/prefectures/${prefectureId}`);
  },
};

export { PrefectureRequest };
