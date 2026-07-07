import { authMapper } from "./authMapper";
import { busMapper } from "./busMapper";
import { prefectureMapper } from "./prefectureMapper";
import { userMapper } from "./userMapper";

const Mapper = {
  user: userMapper,
  auth: authMapper,
  prefecture: prefectureMapper,
  bus: busMapper,
} as const;

export { Mapper };
