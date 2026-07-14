import { Text, View } from "react-native";

function formatCurrentDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  })
    .format(new Date())
    .replace(",", "");
}

function TripsHeaderCard({ title }: { readonly title: string }) {
  return (
    <View className="overflow-hidden pt-5 ">
      <Text className="font-bold text-[#64748B] text-sm uppercase tracking-[1px]">
        Hoje · {formatCurrentDate()}
      </Text>
      <Text className="mt-2 font-bold text-[#051223] text-3xl">{title}</Text>
      <Text className="font-bold mt-4 text-[#64748B] text-sm  tracking-[1px]">
        Cheque todas as viagens disponiveis hoje aqui, caso não exista mais viagens disponíveis, não
        se preocupe, amanhã novas viagens aparecerão.
      </Text>
    </View>
  );
}

export default TripsHeaderCard;
