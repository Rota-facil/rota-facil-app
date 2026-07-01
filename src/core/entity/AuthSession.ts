import type { UserEntity } from "./userEntity";

interface AuthSession {
  user: UserEntity;
  accessToken: string;
}

export type { AuthSession };
