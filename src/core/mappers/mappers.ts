import { authMapper } from "./authMapper";
import { userMapper } from "./userMapper";

const Mapper = {
  user: userMapper,
  auth: authMapper,
} as const;

export { Mapper };
