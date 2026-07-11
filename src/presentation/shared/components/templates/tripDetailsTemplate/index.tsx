import { MaterialIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import type { SimpleTripUserEntity, TripEntity, TripPresence } from "@/core/entity/tripEntity";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { colors } from "@/presentation/shared/styles/colors";
import {
  formatTripTime,
  getPrimaryBoardPointName,
  getPrimaryInstitutionName,
  getProgressSummary,
  getStudentInitials,
  getTripPresenceLabel,
  getTripShiftLabel,
  getTripStatusLabel,
  isTripCancelled,
  isTripFinished,
  isTripInProgress,
  type TripDetailsContext,
  type TripDetailsTab,
} from "./utils";

interface TripDetailsTemplateProps {
  readonly trip: TripEntity | null;
  readonly students: SimpleTripUserEntity[];
  readonly context: TripDetailsContext;
  readonly activeTab: TripDetailsTab;
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly error: string | null;
  readonly roleActions?: ReactNode;
  readonly canEvaluateStudents?: boolean;
  readonly onBack: () => void;
  readonly onRefresh: () => void;
  readonly onRetry: () => void;
  readonly onTabChange: (tab: TripDetailsTab) => void;
  readonly onEvaluateStudent?: (student: SimpleTripUserEntity) => void;
}

const tabOptions: { value: TripDetailsTab; label: string }[] = [
  { value: "summary", label: "Resumo" },
  { value: "students", label: "Alunos" },
  { value: "route", label: "Rota" },
];

function getStatusPillClasses(trip: TripEntity): {
  readonly background: string;
  readonly text: string;
  readonly dot: string;
} {
  if (isTripCancelled(trip)) {
    return {
      background: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500",
    };
  }

  if (isTripFinished(trip)) {
    return {
      background: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    };
  }

  if (isTripInProgress(trip)) {
    return {
      background: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
    };
  }

  return {
    background: "bg-[#EAF3FF]",
    text: "text-[#0D6BEE]",
    dot: "bg-[#0D6BEE]",
  };
}

function getPresenceClasses(presence: TripPresence): {
  readonly background: string;
  readonly text: string;
  readonly icon: "check" | "schedule" | "priority-high";
} {
  if (presence === "CHECKIN") {
    return {
      background: "bg-emerald-50",
      text: "text-emerald-700",
      icon: "check",
    };
  }

  if (presence === "ABSENT") {
    return {
      background: "bg-red-50",
      text: "text-red-600",
      icon: "priority-high",
    };
  }

  return {
    background: "bg-[#EAF3FF]",
    text: "text-[#0D6BEE]",
    icon: "schedule",
  };
}

function LoadingState() {
  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC] px-6 pt-4" edges={["top"]}>
      <View className="h-11 w-11 rounded-full bg-white shadow-sm shadow-blue-100" />
      <View className="mt-5 h-[210px] rounded-[28px] bg-white shadow-sm shadow-blue-100" />
      <View className="mt-4 rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <ActivityIndicator size="large" color={colors.primaryGlow} />
        <Text className="mt-4 text-center font-semibold text-[#5E6A7A]">
          Carregando detalhes da viagem...
        </Text>
      </View>
    </SafeAreaView>
  );
}

function ErrorState({
  error,
  onBack,
  onRetry,
}: Pick<TripDetailsTemplateProps, "error" | "onBack" | "onRetry">) {
  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC] px-6 pt-4" edges={["top"]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={onBack}
        className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm shadow-blue-100"
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
      </Pressable>

      <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <MaterialIcons name="error-outline" size={28} color={colors.stateError} />
        </View>
        <Text className="mt-5 font-bold text-2xl text-[#051223]">
          Não foi possível carregar a viagem
        </Text>
        <Text className="mt-2 text-[#5E6A7A] leading-5">
          {error ?? "Ocorreu um problema ao buscar os detalhes. Tente novamente."}
        </Text>
        <View className="mt-6">
          <SystemButton title="Tentar novamente" iconLeft="refresh" onPress={onRetry} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function TripMapPreview({ trip }: { readonly trip: TripEntity }) {
  const statusLabel = getTripStatusLabel(trip);

  return (
    <View className="overflow-hidden rounded-[28px] bg-white shadow-sm shadow-blue-100">
      <View className="h-[210px] bg-[#EAF3FF]">
        <Svg width="100%" height="100%" viewBox="0 0 360 210">
          <Path
            d="M-18 54 H86 C128 54 134 92 174 92 H378"
            stroke="#D8E7F7"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M-18 158 H76 C118 158 124 124 158 118 L226 98 C258 88 280 66 306 48 L378 48"
            stroke="#D8E7F7"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M38 164 C92 134 124 118 164 116 C210 114 242 82 318 50"
            stroke="#0D6BEE"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M38 164 C92 134 124 118 164 116 C210 114 242 82 318 50"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="8 10"
          />
        </Svg>

        <View className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 shadow-sm shadow-blue-100">
          <Text className="font-bold text-[11px] uppercase text-[#0D6BEE]">{statusLabel}</Text>
        </View>

        <View className="absolute bottom-[54px] left-7 h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] shadow-sm shadow-blue-100">
          <MaterialIcons name="place" size={21} color="#FFFFFF" />
        </View>

        <View className="absolute right-7 top-9 h-9 w-9 items-center justify-center rounded-full bg-[#F5A524] shadow-sm shadow-blue-100">
          <MaterialIcons name="school" size={20} color="#051223" />
        </View>

        <View className="absolute left-[46%] top-[78px] h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF4DA] shadow-sm shadow-blue-100">
          <MaterialIcons name="directions-bus" size={32} color={colors.accentGlow} />
        </View>

        <View className="absolute bottom-4 left-4 right-4 rounded-3xl bg-white/95 p-4">
          <Text className="font-bold text-lg text-[#051223]" numberOfLines={1}>
            {trip.name}
          </Text>
          <Text className="mt-1 text-sm text-[#5E6A7A]" numberOfLines={1}>
            {getPrimaryBoardPointName(trip)} até {getPrimaryInstitutionName(trip)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TripHeader({
  context,
  onBack,
  trip,
}: {
  readonly context: TripDetailsContext;
  readonly onBack: () => void;
  readonly trip: TripEntity;
}) {
  const statusClasses = getStatusPillClasses(trip);
  const title = context === "driver" ? "Detalhes operacionais" : "Detalhes da viagem";

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={onBack}
          className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm shadow-blue-100"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>

        <View className="flex-1">
          <Text className="font-bold text-2xl text-[#051223]">{title}</Text>
          <Text className="mt-0.5 text-sm text-[#5E6A7A]">
            {getTripShiftLabel(trip.route.shift)} · {trip.route.name}
          </Text>
        </View>
      </View>

      <TripMapPreview trip={trip} />

      <View className="flex-row items-start justify-between gap-3 rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <View className="flex-1">
          <Text className="text-[11px] font-bold uppercase text-[#64748B]">
            Status atual da viagem
          </Text>
          <Text className="mt-1 font-bold text-xl text-[#051223]">{getTripStatusLabel(trip)}</Text>
          <Text className="mt-1 text-sm text-[#5E6A7A]">
            Placa {trip.bus.plate || "não informada"}
          </Text>
        </View>

        <View
          className={`flex-row items-center rounded-full px-3 py-1 ${statusClasses.background}`}
        >
          <View className={`mr-1.5 h-2 w-2 rounded-full ${statusClasses.dot}`} />
          <Text className={`text-[11px] font-bold ${statusClasses.text}`}>
            {getTripStatusLabel(trip)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  readonly icon: React.ComponentProps<typeof MaterialIcons>["name"];
  readonly label: string;
  readonly value: string;
}) {
  return (
    <View className="min-h-[82px] flex-1 rounded-2xl bg-[#F8FAFC] p-3">
      <MaterialIcons name={icon} size={19} color={colors.primaryGlow} />
      <Text className="mt-1 text-[10px] font-bold uppercase text-[#64748B]">{label}</Text>
      <Text className="mt-0.5 font-bold text-sm text-[#051223]">{value}</Text>
    </View>
  );
}

function TripProgressPanel({
  trip,
  students,
}: {
  readonly trip: TripEntity;
  readonly students: SimpleTripUserEntity[];
}) {
  const summary = getProgressSummary(students, trip.students);

  if (!isTripInProgress(trip)) {
    return null;
  }

  return (
    <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-bold uppercase text-[#64748B]">Progresso da viagem</Text>
        <Text className="font-bold text-lg text-[#051223]">{summary.percentage}%</Text>
      </View>

      <View className="mt-4 h-3 overflow-hidden rounded-full bg-[#E5EAF0]">
        <View
          className="h-full rounded-full bg-[#3B82F6]"
          style={{ width: `${summary.percentage}%` }}
        />
      </View>

      <View className="mt-4 flex-row gap-2">
        <MetricCard icon="check-circle" label="Presentes" value={String(summary.checkedIn)} />
        <MetricCard icon="schedule" label="Pendentes" value={String(summary.pending)} />
        <MetricCard icon="priority-high" label="Ausentes" value={String(summary.absent)} />
      </View>
    </View>
  );
}

function TripTabs({
  activeTab,
  onTabChange,
}: Pick<TripDetailsTemplateProps, "activeTab" | "onTabChange">) {
  return (
    <View className="flex-row rounded-2xl bg-white p-1 shadow-sm shadow-blue-100">
      {tabOptions.map((option) => {
        const isSelected = option.value === activeTab;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={isSelected ? { selected: true } : undefined}
            onPress={() => onTabChange(option.value)}
            className={`h-11 flex-1 items-center justify-center rounded-xl ${
              isSelected ? "bg-[#0D6BEE]" : "bg-white"
            }`}
          >
            <Text className={`font-bold text-sm ${isSelected ? "text-white" : "text-[#5E6A7A]"}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SummaryTab({
  trip,
  students,
}: {
  readonly trip: TripEntity;
  readonly students: SimpleTripUserEntity[];
}) {
  const summary = getProgressSummary(students, trip.students);
  const boardPointName = getPrimaryBoardPointName(trip);
  const institutionName = getPrimaryInstitutionName(trip);

  return (
    <View className="gap-4">
      <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <Text className="text-[11px] font-bold uppercase text-[#64748B]">Resumo da viagem</Text>
        <Text className="mt-2 font-bold text-xl text-[#051223]">{trip.route.name}</Text>
        <Text className="mt-2 text-sm text-[#5E6A7A] leading-5">
          Esta rota sai de {boardPointName} e segue até {institutionName}. A ida está prevista para{" "}
          {formatTripTime(trip.route.going)}, com acompanhamento do ônibus e confirmação de presença
          pelo check-in.
        </Text>

        <View className="mt-4 flex-row gap-2">
          <MetricCard icon="schedule" label="Ida" value={formatTripTime(trip.route.going)} />
          <MetricCard icon="group" label="Alunos" value={String(summary.total)} />
          <MetricCard
            icon="how-to-reg"
            label="Check-ins"
            value={`${summary.checkedIn}/${summary.total}`}
          />
        </View>
      </View>

      <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4DA]">
            <MaterialIcons name="directions-bus" size={27} color={colors.accentGlow} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[11px] font-bold uppercase text-[#64748B]">Ônibus</Text>
            <Text className="mt-1 font-bold text-lg text-[#051223]">
              {trip.bus.plate || "Placa não informada"}
            </Text>
            <Text className="mt-0.5 text-sm text-[#5E6A7A]">
              Capacidade: {trip.bus.capacity || "não informada"} lugares
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function EmptyStudentsState() {
  return (
    <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
        <MaterialIcons name="group-off" size={26} color={colors.primaryGlow} />
      </View>
      <Text className="mt-5 font-bold text-xl text-[#051223]">Nenhum aluno listado</Text>
      <Text className="mt-2 text-[#5E6A7A] leading-5">
        Quando houver alunos vinculados à viagem, eles aparecerão aqui.
      </Text>
    </View>
  );
}

function SimpleStudentListItem({ student }: { readonly student: SimpleTripUserEntity }) {
  const presenceClasses = getPresenceClasses(student.presence);

  return (
    <View className="flex-row items-center rounded-2xl border border-[#E5EAF0] bg-white px-4 py-3 shadow-sm shadow-blue-100">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF]">
        <Text className="font-bold text-[#0D6BEE]">{getStudentInitials(student.user.name)}</Text>
      </View>

      <View className="ml-3 flex-1">
        <Text className="font-bold text-base text-[#051223]" numberOfLines={1}>
          {student.user.name}
        </Text>
        <Text className="mt-0.5 text-xs text-[#5E6A7A]" numberOfLines={1}>
          {student.boardPointName}
        </Text>
      </View>

      <View className={`rounded-full px-2.5 py-1 ${presenceClasses.background}`}>
        <Text className={`text-[10px] font-bold ${presenceClasses.text}`}>
          {getTripPresenceLabel(student.presence)}
        </Text>
      </View>
    </View>
  );
}

function DriverStudentListItem({
  canEvaluate,
  onEvaluate,
  student,
}: {
  readonly canEvaluate: boolean;
  readonly onEvaluate?: (student: SimpleTripUserEntity) => void;
  readonly student: SimpleTripUserEntity;
}) {
  const presenceClasses = getPresenceClasses(student.presence);
  const hasScore = student.score > 0;
  const scoreLabel = hasScore ? `${student.score}/5` : "Sem avaliação";

  return (
    <View className="rounded-[24px] border border-[#E5EAF0] bg-white px-4 py-4 shadow-sm shadow-blue-100">
      <View className="flex-row items-start">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#0D6BEE]">
          <Text className="font-bold text-white">{getStudentInitials(student.user.name)}</Text>
        </View>

        <View className="ml-3 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="font-bold text-base text-[#051223]" numberOfLines={1}>
                {student.user.name}
              </Text>
              <Text className="mt-0.5 text-xs font-semibold text-[#64748B]" numberOfLines={1}>
                {student.going && student.returning
                  ? "Ida e retorno confirmados"
                  : student.going
                    ? "Somente ida"
                    : "Somente retorno"}
              </Text>
            </View>

            <View
              className={`flex-row items-center rounded-full px-2.5 py-1 ${presenceClasses.background}`}
            >
              <MaterialIcons name={presenceClasses.icon} size={14} color={colors.foreground} />
              <Text className={`ml-1 text-[10px] font-bold ${presenceClasses.text}`}>
                {getTripPresenceLabel(student.presence)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-4 border-t border-[#E5EAF0] pt-4">
        <View className="flex-row items-start">
          <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-[#FFF4DA]">
            <MaterialIcons name="place" size={18} color={colors.accentGlow} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[10px] font-bold uppercase text-[#64748B]">Embarque</Text>
            <Text className="mt-0.5 font-semibold text-sm text-[#051223]" numberOfLines={2}>
              {student.boardPointName}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-start">
          <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-[#EAF3FF]">
            <MaterialIcons name="school" size={18} color={colors.primaryGlow} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[10px] font-bold uppercase text-[#64748B]">Destino</Text>
            <Text className="mt-0.5 font-semibold text-sm text-[#051223]" numberOfLines={2}>
              {student.institutionName}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-[#E5EAF0] pt-3">
        <View className="flex-row items-center">
          <MaterialIcons name="star" size={17} color={colors.accentGlow} />
          <Text className="ml-1.5 text-xs font-bold text-[#5E6A7A]">Avaliação {scoreLabel}</Text>
        </View>

        {canEvaluate && onEvaluate && !hasScore ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onEvaluate(student)}
            className="flex-row items-center rounded-full bg-[#FFF4DA] px-3 py-2 active:opacity-80"
          >
            <MaterialIcons name="star" size={16} color={colors.accentGlow} />
            <Text className="ml-1.5 text-xs font-bold text-[#92400E]">Avaliar</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function RouteTab({ trip }: { readonly trip: TripEntity }) {
  const boardPoints = trip.route.boardPoints;

  if (boardPoints.length === 0) {
    return (
      <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
        <Text className="font-bold text-xl text-[#051223]">Rota indisponível</Text>
        <Text className="mt-2 text-[#5E6A7A]">
          Nenhum ponto de embarque foi informado para esta viagem.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <Text className="text-[11px] font-bold uppercase text-[#64748B]">Sequência de paradas</Text>

      <View className="mt-4">
        {boardPoints.map((point, index) => {
          const isLast = index === boardPoints.length - 1;
          const isCurrent = isTripInProgress(trip) && index === 0;
          const markerColor = isCurrent ? colors.primaryGlow : colors.border;

          return (
            <View key={point.id} className="flex-row">
              <View className="items-center">
                <View
                  className="h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: isCurrent ? "#EAF3FF" : "#F8FAFC" }}
                >
                  <MaterialIcons
                    name={isCurrent ? "directions-bus" : "radio-button-unchecked"}
                    size={18}
                    color={markerColor}
                  />
                </View>
                {!isLast ? <View className="h-10 w-px bg-[#E5EAF0]" /> : null}
              </View>

              <View className="ml-3 flex-1 pb-5">
                <Text className="font-bold text-base text-[#051223]">{point.name}</Text>
                <Text className="mt-0.5 text-sm text-[#5E6A7A]">Parada {index + 1}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function TripDetailsTemplate({
  activeTab,
  canEvaluateStudents = false,
  context,
  error,
  isLoading,
  isRefreshing,
  onBack,
  onEvaluateStudent,
  onRefresh,
  onRetry,
  onTabChange,
  roleActions,
  students,
  trip,
}: TripDetailsTemplateProps) {
  if (isLoading && !trip) {
    return <LoadingState />;
  }

  if (!trip) {
    return <ErrorState error={error} onBack={onBack} onRetry={onRetry} />;
  }

  const listData = activeTab === "students" ? students : [];

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top"]}>
      <FlatList
        data={listData}
        keyExtractor={(student) => student.id}
        contentContainerClassName="px-6 pt-4 pb-32 gap-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primaryGlow]}
            tintColor={colors.primaryGlow}
          />
        }
        ListHeaderComponent={
          <View className="gap-4">
            <TripHeader context={context} trip={trip} onBack={onBack} />
            <TripProgressPanel trip={trip} students={students} />
            <TripTabs activeTab={activeTab} onTabChange={onTabChange} />

            {activeTab === "summary" ? <SummaryTab trip={trip} students={students} /> : null}
            {activeTab === "route" ? <RouteTab trip={trip} /> : null}
            {activeTab === "students" && students.length === 0 ? <EmptyStudentsState /> : null}
          </View>
        }
        renderItem={({ item }) =>
          context === "driver" ? (
            <DriverStudentListItem
              student={item}
              canEvaluate={canEvaluateStudents}
              onEvaluate={onEvaluateStudent}
            />
          ) : (
            <SimpleStudentListItem student={item} />
          )
        }
        ListFooterComponent={
          roleActions && activeTab === "summary" ? (
            <View className="mt-2">{roleActions}</View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

export type { TripDetailsTab };
export { TripDetailsTemplate };
