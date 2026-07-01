enum Region {
  NORTH,
  SOUTH,
  SOUTHEAST,
  WEST,
  EAST,
  NORTH_EAST,
  WEST_CENTER,
}

interface PrefecturesEntity {
  id: string;
  name: string;
  region: Region;
}

export type { PrefecturesEntity, Region };
