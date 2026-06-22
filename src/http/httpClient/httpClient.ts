import { HttpError } from "@/core/errors/httpError";
import { config } from "./config";

/**
 * Cliente HTTP
 *
 * Responsabilidade: executar requisições e devolver o corpo já parseado,
 * lançando um erro padronizado em caso de status não-OK.
 *
 */
const httpClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "POST", body: JSON.stringify(body) }),
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new HttpError(response.status, `Falha na requisição: ${response.status}`);
  }

  return (await response.json()) as T;
}

export { httpClient };
