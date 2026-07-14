import { SoftError } from "@/errors/errors";

type GoogleLoginResult =
  | {
      readonly type: "authenticated";
      readonly accessToken: string;
    }
  | {
      readonly type: "registrationRequired";
      readonly pendingToken: string;
    }
  | {
      readonly type: "cancelled";
    };

const GOOGLE_OAUTH_CALLBACK_SCHEME = "rotafacil:";
const GOOGLE_OAUTH_CALLBACK_HOST = "auth";
const GOOGLE_OAUTH_AUTHENTICATED_PATH = "/oauth2/callback";
const GOOGLE_OAUTH_REGISTRATION_REQUIRED_PATH = "/complete-login";

function parseGoogleOAuthCallback(callbackUrl: string): GoogleLoginResult {
  let url: URL;

  try {
    url = new URL(callbackUrl);
  } catch {
    throw new SoftError("Retorno do login Google inválido.");
  }

  if (url.protocol !== GOOGLE_OAUTH_CALLBACK_SCHEME) {
    throw new SoftError("Retorno do login Google possui protocolo inválido.");
  }

  if (url.hostname !== GOOGLE_OAUTH_CALLBACK_HOST) {
    throw new SoftError("Retorno do login Google possui origem inválida.");
  }

  const token = url.searchParams.get("token")?.trim();

  if (!token) {
    throw new SoftError("Retorno do login Google não informou o token.");
  }

  if (url.pathname === GOOGLE_OAUTH_AUTHENTICATED_PATH) {
    return {
      type: "authenticated",
      accessToken: token,
    };
  }

  if (url.pathname === GOOGLE_OAUTH_REGISTRATION_REQUIRED_PATH) {
    return {
      type: "registrationRequired",
      pendingToken: token,
    };
  }

  throw new SoftError("Retorno do login Google possui caminho inválido.");
}

export type { GoogleLoginResult };
export { parseGoogleOAuthCallback };
