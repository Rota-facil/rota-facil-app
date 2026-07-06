import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { type Control, Controller, get } from "react-hook-form";
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import type { PrefectureEntity } from "@/core/entity/prefectureEntity";
import type { RegisterFormSchema } from "@/presentation/shared/schemas/registerSchema";
import { colors } from "@/presentation/shared/styles/colors";

interface PrefectureSelectProps {
  control: Control<RegisterFormSchema>;
  name: "prefectureId";
  label: string;
  placeholder: string;
  prefectures: PrefectureEntity[];
  loading?: boolean;
  error?: string | null;
}

function PrefectureSelect({
  control,
  name,
  label,
  placeholder,
  prefectures,
  loading = false,
  error,
}: PrefectureSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => {
        const fieldError = get(formState.errors, name);
        const selectedPrefecture = prefectures.find((prefecture) => prefecture.id === field.value);

        return (
          <View>
            <Text className="mb-2 text-sm font-semibold text-[#5E6A7A]">{label}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading}
              onPress={() => setIsOpen(true)}
              className="h-14 flex-row items-center rounded-2xl border px-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <MaterialIcons name="business" size={20} color={colors.muted} />

              <Text
                className="ml-3 flex-1 text-base"
                style={{ color: selectedPrefecture ? colors.textDefault : colors.muted }}
                numberOfLines={1}
              >
                {loading ? "Carregando prefeituras..." : (selectedPrefecture?.name ?? placeholder)}
              </Text>

              <MaterialIcons name="keyboard-arrow-down" size={22} color={colors.muted} />
            </TouchableOpacity>

            <Text className="mt-2 text-xs text-[#5E6A7A]">
              Todo aluno está vinculado a uma prefeitura municipal.
            </Text>

            {(fieldError?.message || error) && (
              <Text className="mt-2 text-sm text-[#DC2626]">
                {String(fieldError?.message ?? error)}
              </Text>
            )}

            <Modal
              visible={isOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setIsOpen(false)}
            >
              <Pressable
                className="flex-1 justify-end bg-black/40"
                onPress={() => setIsOpen(false)}
              >
                <Pressable className="max-h-[72%] rounded-t-3xl bg-white p-5">
                  <View className="mb-4 flex-row items-center justify-between">
                    <View>
                      <Text className="font-bold text-lg text-[#051223]">
                        Selecione a prefeitura
                      </Text>

                      <Text className="mt-1 text-sm text-[#5E6A7A]">
                        Escolha a rede municipal do aluno.
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => setIsOpen(false)} activeOpacity={0.8}>
                      <MaterialIcons name="close" size={24} color={colors.muted} />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={prefectures}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                      <Text className="py-5 text-center text-[#5E6A7A]">
                        Nenhuma prefeitura disponível.
                      </Text>
                    }
                    renderItem={({ item }) => {
                      const isSelected = item.id === field.value;

                      return (
                        <TouchableOpacity
                          activeOpacity={0.82}
                          onPress={() => {
                            field.onChange(item.id);
                            setIsOpen(false);
                          }}
                          className="mb-3 min-h-16 flex-row items-center rounded-2xl border px-4 py-3"
                          style={{
                            borderColor: isSelected ? colors.primaryGlow : colors.border,
                            backgroundColor: isSelected ? "#EFF6FF" : colors.surface,
                          }}
                        >
                          <View
                            className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: isSelected ? colors.primaryGlow : "#EEF2F7",
                            }}
                          >
                            <MaterialIcons
                              name="account-balance"
                              size={21}
                              color={isSelected ? "#FFFFFF" : colors.muted}
                            />
                          </View>

                          <View className="flex-1">
                            <Text
                              className="font-semibold text-base text-[#051223]"
                              numberOfLines={1}
                            >
                              {item.name}
                            </Text>

                            <Text className="mt-1 text-xs text-[#5E6A7A]" numberOfLines={1}>
                              {item.region}
                            </Text>
                          </View>

                          <View
                            className="ml-3 h-8 w-8 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: isSelected ? colors.primaryGlow : "#F8FAFC",
                            }}
                          >
                            <MaterialIcons
                              name={isSelected ? "check" : "chevron-right"}
                              size={20}
                              color={isSelected ? "#FFFFFF" : colors.muted}
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        );
      }}
    />
  );
}

export { PrefectureSelect };
