interface LoginDTO {
  email: string;
  password: string;
}

interface LoginResponseDTO {
  accessToken: string;
}

interface CompleteGoogleRegistrationRequestDTO {
  cpf: string;
  prefectureId: string;
}

export type { CompleteGoogleRegistrationRequestDTO, LoginDTO, LoginResponseDTO };
