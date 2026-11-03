import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

describe("MSW - Auth Handlers", () => {
  it("deve interceptar GET /auth/me e retornar os dados mockados", async () => {
    const response = await fetch("https://api.example.com/auth");

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({
      id: "user-1234",
      name: "Usuário de teste para auth",
    });
  });
});

describe("MSW - integração HTTP", () => {
  it("intercepta a requisição e retorna a resposta mockada", async () => {
    const response = await fetch("https://api.example.com/auth/me");

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      id: "user-1234",
      name: "Usuário de teste",
    });
  });
});

function TestScreen() {
  return (
    <View>
      <Text>Rota Fácil</Text>
      <Text>Ambiente de testes funcionando</Text>
    </View>
  );
}

describe("TestScreen - renderização", () => {
  it("renderiza os textos esperados", async () => {
    await render(<TestScreen />);

    expect(screen.getByText("Rota Fácil")).toBeTruthy();
    expect(screen.getByText("Ambiente de testes funcionando")).toBeTruthy();
  });
});
