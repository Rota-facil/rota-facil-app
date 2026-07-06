type Region = string;

interface PrefectureEntity {
  id: string;
  name: string;
  region: Region;
}

type PrefecturesEntity = PrefectureEntity;

export type { PrefectureEntity, PrefecturesEntity, Region };
