import { authMapper } from "./authMapper";
import { busMapper } from "./busMapper";
import { driverMapper } from "./driverMapper";
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
} as const;

export { Mapper };
