import { HttpResponse, http } from "msw";

export const authHandlers = [
  http.get("https://api.example.com/auth/me", () => {
    return HttpResponse.json({
      id: "user-1234",
      name: "Usuário de teste",
    });
  }),
];

export const handlers = [
  http.get("https://api.example.com/auth", () => {
    return HttpResponse.json(
      {
        id: "user-1234",
        name: "Usuário de teste para auth",
      },
      { status: 201 },
    );
  }),
];

const mockTestsHandlers = [...authHandlers, ...handlers];

export { mockTestsHandlers };
