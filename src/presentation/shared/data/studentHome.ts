export const studentHomeMock = {
  user: {
    greeting: "Bom dia,",
    name: "Ana",
    organization: "Prefeitura de São Paulo",
    unreadNotifications: 2,
  },

  currentTrip: {
    label: "Próxima viagem",
    route: "Rota 12 — Centro",
    status: "Em andamento",
    eta: "8 min",
    progress: "62%",
    seats: "11",
    driver: {
      name: "Carlos Oliveira",
      rating: "4.9",
      vehicle: "RFA-2J47",
    },
  },

  actions: [
    {
      id: "check-in",
      title: "Check-in",
      subtitle: "Escanear QR",
      icon: "qr-code" as const,
      variant: "primary" as const,
    },
    {
      id: "map",
      title: "Mapa",
      subtitle: "Ver ao vivo",
      icon: "location-on" as const,
      variant: "accent" as const,
    },
  ],

  statusAlert: {
    title: "Estou aguardando no ponto",
    description: "Avise o motorista que você já está aqui.",
  },

  notifications: [
    {
      id: "1",
      title: "Seu ônibus está próximo",
      description: "Rota 12 chega em 3 min no Ponto Praça Central.",
      time: "agora",
    },
    {
      id: "2",
      title: "Viagem iniciada",
      description: "Carlos saiu da garagem. Acompanhe em tempo real.",
      time: "12 min",
    },
    {
      id: "3",
      title: "Check-in confirmado",
      description: "Sua presença foi registrada às 06:42.",
      time: "1h",
    },
  ],
};
