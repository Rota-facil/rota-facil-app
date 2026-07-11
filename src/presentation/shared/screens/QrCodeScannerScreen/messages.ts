import type { QrCodeErrorCode } from "@/errors/errors";

interface QrCodeErrorContent {
  readonly title: string;
  readonly description: string;
}

const qrCodeErrorMessages: Record<QrCodeErrorCode, QrCodeErrorContent> = {
  CAMERA_PERMISSION_BLOCKED: {
    title: "Acesso a camera bloqueado",
    description: "Ative a permissao da camera nas configuracoes do dispositivo.",
  },
  CAMERA_PERMISSION_DENIED: {
    title: "Acesso a camera negado",
    description: "Permita o acesso a camera para ler QR Codes.",
  },
  EMPTY_CONTENT: {
    title: "QR Code vazio",
    description: "Leia um QR Code valido do Rota Facil.",
  },
  EXTERNAL_CONTENT: {
    title: "QR Code nao reconhecido",
    description: "Este codigo nao pertence ao Rota Facil.",
  },
  INCOMPATIBLE_IDENTIFIER: {
    title: "QR Code de outra viagem",
    description: "Leia o codigo correspondente a viagem atual.",
  },
  INCOMPATIBLE_TYPE: {
    title: "QR Code incompatível",
    description: "Este codigo nao pode ser utilizado neste fluxo.",
  },
  INVALID_IDENTIFIER: {
    title: "QR Code invalido",
    description: "O identificador deste QR Code nao pode ser utilizado.",
  },
  MALFORMED_CONTENT: {
    title: "QR Code invalido",
    description: "Nao foi possivel interpretar este codigo.",
  },
  UNKNOWN: {
    title: "Nao foi possivel ler o QR Code",
    description: "Tente posicionar o codigo novamente dentro da area indicada.",
  },
  UNSUPPORTED_VERSION: {
    title: "QR Code desatualizado",
    description: "Esta versao de QR Code nao e suportada pelo aplicativo.",
  },
};

function getQrCodeErrorContent(code?: QrCodeErrorCode): QrCodeErrorContent {
  if (!code) {
    return qrCodeErrorMessages.UNKNOWN;
  }

  return qrCodeErrorMessages[code];
}

export type { QrCodeErrorContent };
export { getQrCodeErrorContent };
