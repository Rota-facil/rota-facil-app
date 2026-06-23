import { View } from "react-native";

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
}

export function PaginationDots({ total, currentIndex }: PaginationDotsProps) {
  return (
    <View className="flex-row space-x-2 mb-8 items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;

        return (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: pagination dots have fixed order
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              isActive ? "w-6 bg-blue-600" : "w-2 bg-slate-300"
            }`}
          />
        );
      })}
    </View>
  );
}
