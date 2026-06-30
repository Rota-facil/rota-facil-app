import { HttpClientError, HttpServerError } from "@/errors/errors";
import { config } from "./config";

/**
 * Cliente HTTP
 *
 * Responsabilidade: executar requisições e devolver o corpo já parseado,
 * lançando um erro padronizado em caso de status não-OK.
 */
const httpClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "DELETE" }),
};

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${config.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new HttpClientError("Falha ao conectar com o servidor");
  }

  if (!response.ok) {
    let message = `Falha na requisição (${response.status})`;

    try {
      const body = await response.json();

      if (body?.message) {
        message = body.message;
      }
    } catch {
      // Ignora erros de parse e mantém mensagem padrão
    }

    throw new HttpServerError(message, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new HttpClientError("Falha ao processar resposta do servidor");
  }
}

export { httpClient };
