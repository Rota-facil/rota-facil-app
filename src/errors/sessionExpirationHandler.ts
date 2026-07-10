type SessionExpirationHandler = () => void | Promise<void>;

let sessionExpirationHandler: SessionExpirationHandler | null = null;

/**
 * Registra a reação da aplicação quando uma sessão expira.
 *
 * A camada de erros detecta o 401 e limpa as credenciais persistidas, mas não deve
 * depender de navegação ou contexto React. O SessionProvider registra esse callback
 * para sincronizar a sessão em memória e redirecionar o usuário para o login.
 */
function setSessionExpirationHandler(handler: SessionExpirationHandler) {
  sessionExpirationHandler = handler;

  return () => {
    if (sessionExpirationHandler === handler) {
      sessionExpirationHandler = null;
    }
  };
}

/**
 * Notifica o boundary de sessão de que a sessão atual expirou.
 *
 * Se nenhum provider estiver montado, a chamada é intencionalmente inofensiva:
 * as credenciais persistidas já foram limpas pelo handler de erro.
 */
async function notifySessionExpired(): Promise<void> {
  await sessionExpirationHandler?.();
}

export { notifySessionExpired, setSessionExpirationHandler };
