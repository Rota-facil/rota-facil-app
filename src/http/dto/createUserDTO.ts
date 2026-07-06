interface CreateUserDTO {
  prefectureId: string;
  name: string;
  password: string;
  email: string;
  cpf: string;
}

interface CreateUserResponseDTO {
  accessToken: string;
}

export type { CreateUserDTO, CreateUserResponseDTO };
