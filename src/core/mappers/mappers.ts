import { authMapper } from "./authMapper";
import { busMapper } from "./busMapper";
import { driverMapper } from "./driverMapper";
import { evaluationMapper } from "./evaluationMapper";
import { placeMapper } from "./placeMapper";
import { prefectureMapper } from "./prefectureMapper";
import { tripMapper } from "./tripMapper";
import { userMapper } from "./userMapper";

const Mapper = {
  user: userMapper,
  auth: authMapper,
  prefecture: prefectureMapper,
  bus: busMapper,
  driver: driverMapper,
  trip: tripMapper,
  evaluation: evaluationMapper,
  place: placeMapper,
} as const;

export { Mapper };
