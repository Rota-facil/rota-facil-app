import { HttpClientError, HttpServerError } from "@/errors/errors";
import { config } from "./config";
import { extractErrorMessage } from "./extractErrorMessage";

/**
 * Cliente HTTP
 *
 * Responsabilidade: executar requisições e devolver o corpo já parseado,
 * lançando um erro padronizado em caso de status não-OK.
 */
const httpClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, buildRequestInit("POST", body, init)),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, buildRequestInit("PUT", body, init)),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, buildRequestInit("PATCH", body, init)),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "DELETE" }),
};

function buildRequestInit(method: string, body?: unknown, init?: RequestInit): RequestInit {
  return {
    ...init,
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

function hasAuthorizationHeader(headers?: HeadersInit): boolean {
  if (!headers) {
    return false;
  }

  if (headers instanceof Headers) {
    return headers.has("authorization");
  }

  if (Array.isArray(headers)) {
    return headers.some(([key]) => key.toLowerCase() === "authorization");
  }

  return Object.keys(headers).some((key) => key.toLowerCase() === "authorization");
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  const shouldExpireSession = hasAuthorizationHeader(init?.headers);

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
      const bodyMessage = extractErrorMessage(body);

      if (bodyMessage) {
        message = bodyMessage;
      }
    } catch {
      // Ignora erros de parse e mantém mensagem padrão
    }

    throw new HttpServerError(message, response.status, shouldExpireSession);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let responseText: string;

  try {
    responseText = await response.text();
  } catch {
    throw new HttpClientError("Falha ao processar resposta do servidor");
  }

  if (!responseText) {
    return undefined as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new HttpClientError("Falha ao processar resposta do servidor");
  }
}

export { httpClient };
