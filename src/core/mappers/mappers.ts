import { authMapper } from "./authMapper";
import { busMapper } from "./busMapper";
import { driverMapper } from "./driverMapper";
import { prefectureMapper } from "./prefectureMapper";
import { userMapper } from "./userMapper";

const Mapper = {
  user: userMapper,
  auth: authMapper,
  prefecture: prefectureMapper,
  bus: busMapper,
  driver: driverMapper,
} as const;

export { Mapper };
