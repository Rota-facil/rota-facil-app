import type { Feather, MaterialIcons } from "@expo/vector-icons";

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;
type FeatherIconName = keyof typeof Feather.glyphMap;

type SlideData = {
  id: number;
  title: string;
  description: string;
  gradientColors: [string, string];
} & (
  | {
      iconName: MaterialIconName;
      iconType: "material";
    }
  | {
      iconName: FeatherIconName;
      iconType: "feather";
    }
);

export const Slides: SlideData[] = [
  {
    id: 1,
    title: "Acompanhe em tempo real",
    description: "Veja exatamente onde está o ônibus, ETA e o progresso da rota no mapa.",
    iconName: "location-on",
    iconType: "material",
    gradientColors: ["#1E3A8A", "#3B82F6"],
  },
  {
    id: 2,
    title: "Check-in via QR Code",
    description: "Escaneie o QR do ônibus ao embarcar e registre sua presença instantaneamente.",
    iconName: "qr-code-scanner",
    iconType: "material",
    gradientColors: ["#D97706", "#F59E0B"],
  },
  {
    id: 3,
    title: "Avisos importantes",
    description: "Receba notificações sobre embarque, mudanças de rota, atrasos e cancelamentos.",
    iconName: "bell",
    iconType: "feather",
    gradientColors: ["#16A34A", "#3B82F6"],
  },
];
