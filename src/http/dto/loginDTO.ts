interface LoginDTO {
  email: string;
  password: string;
}

interface LoginResponseDTO {
  accessToken: string;
}

export type { LoginDTO, LoginResponseDTO };
