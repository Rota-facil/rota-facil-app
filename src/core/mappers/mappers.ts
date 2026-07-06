import { authMapper } from "./authMapper";
import { prefectureMapper } from "./prefectureMapper";
import { userMapper } from "./userMapper";

const Mapper = {
  user: userMapper,
  auth: authMapper,
  prefecture: prefectureMapper,
} as const;

export { Mapper };
