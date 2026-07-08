import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDriver } from "@/hooks/useDriver";
import { useUser } from "@/hooks/useUser";
import { DestructiveConfirmation } from "@/presentation/shared/components/molecules/destructiveConfirmation";
import { ProfileActionItem } from "@/presentation/shared/components/molecules/profileActionItem";
import { ProfileTemplate } from "@/presentation/shared/components/templates/profileTemplate";
import { formatCpf } from "@/presentation/shared/utils/cpf";

const deleteConfirmationText = "excluir minha conta";

function DriverProfileScreen() {
  const { logout, isLoading: isLoggingOut } = useAuth();
  const { driver, isLoading, error, loadDriver } = useDriver();
  const { error: accountError, deleteAccount } = useUser();
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [isDeletingAccount, setDeletingAccount] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDriver();
    }, [loadDriver]),
  );

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);

    const wasDeleted = await deleteAccount();

    setDeletingAccount(false);

    if (wasDeleted) {
      setDeleteConfirmationVisible(false);
      router.replace("/(auth)/login");
    }
  };

  return (
    <>
      <ProfileTemplate
        roleLabel="Motorista"
        name={driver?.name ?? ""}
        email={driver?.email ?? ""}
        organization={driver?.prefecture.name}
        loading={isLoading && !driver}
        error={!driver ? error : null}
        emptyMessage={
          !isLoading && !driver ? "Nenhum dado de motorista foi encontrado." : undefined
        }
        footer="Rota Fácil · Motorista"
        metrics={
          driver
            ? [
                {
                  label: "avaliação",
                  value: String(driver.score),
                  icon: "star-outline",
                },
                {
                  label: "concluídas",
                  value: String(driver.completedTrips),
                  icon: "event",
                },
                {
                  label: "total",
                  value: String(driver.trips),
                  icon: "route",
                },
                {
                  label: "status",
                  value: driver.status === "ON_ROUTE" ? "Em rota" : "Disponível",
                  icon: "verified-user",
                },
              ]
            : []
        }
        infoItems={
          driver
            ? [
                {
                  label: "CPF",
                  value: formatCpf(driver.cpf),
                  icon: "badge",
                },
                {
                  label: "Prefeitura",
                  value: driver.prefecture.name,
                  icon: "account-balance",
                },
                {
                  label: "Ônibus",
                  value: driver.bus.plate,
                  icon: "directions-bus",
                },
              ]
            : []
        }
        actionGroups={[
          {
            title: "Conta",
            children: (
              <>
                <ProfileActionItem
                  title="Meu ônibus"
                  subtitle="Consulte o veículo associado ao seu perfil"
                  icon="directions-bus"
                  onPress={() => router.push("/(private)/driver/profile/bus")}
                />
                <ProfileActionItem
                  title="Sair da conta"
                  subtitle="Encerrar a sessão neste dispositivo"
                  icon="logout"
                  disabled={isLoggingOut}
                  destructive
                  onPress={logout}
                />
                <ProfileActionItem
                  title="Excluir conta"
                  subtitle="Remover sua conta permanentemente"
                  icon="delete-outline"
                  destructive
                  onPress={() => setDeleteConfirmationVisible(true)}
                />
              </>
            ),
          },
        ]}
      />

      <DestructiveConfirmation
        visible={isDeleteConfirmationVisible}
        title="Excluir conta"
        description="A exclusão da conta remove seu acesso ao Rota Fácil. Esta ação só deve ser executada quando você tiver certeza."
        confirmationText={deleteConfirmationText}
        actionLabel="Excluir conta"
        loading={isDeletingAccount}
        error={accountError}
        onCancel={() => setDeleteConfirmationVisible(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}

export default DriverProfileScreen;
