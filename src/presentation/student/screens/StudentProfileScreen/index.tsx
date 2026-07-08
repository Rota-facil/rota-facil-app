import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { DestructiveConfirmation } from "@/presentation/shared/components/molecules/destructiveConfirmation";
import { ProfileActionItem } from "@/presentation/shared/components/molecules/profileActionItem";
import { ProfileTemplate } from "@/presentation/shared/components/templates/profileTemplate";
import { formatCpf } from "@/presentation/shared/utils/cpf";

const deleteConfirmationText = "excluir minha conta";

function StudentProfileScreen() {
  const { logout, isLoading: isLoggingOut } = useAuth();
  const { user, isLoading, error, loadUser, deleteAccount } = useUser();
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [isDeletingAccount, setDeletingAccount] = useState(false);
  const student = user?.role === "STUDENT" ? user : null;

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser]),
  );

  useEffect(() => {
    if (user && user.role !== "STUDENT") {
      router.replace("/(private)/driver/profile");
    }
  }, [user]);

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
        roleLabel="Estudante"
        name={student?.name ?? ""}
        email={student?.email ?? ""}
        organization={student?.prefecture.name}
        loading={isLoading && !student}
        error={!student ? error : null}
        emptyMessage={
          !isLoading && !student ? "Nenhum dado de estudante foi encontrado." : undefined
        }
        footer="Rota Fácil · Estudante"
        metrics={
          student
            ? [
                {
                  label: "viagens",
                  value: String(student.completedTrips),
                  icon: "directions-bus",
                },
                {
                  label: "pontos",
                  value: String(student.score),
                  icon: "star-outline",
                },
                {
                  label: "status",
                  value: student.active ? "Ativo" : "Inativo",
                  icon: "verified-user",
                },
              ]
            : []
        }
        infoItems={
          student
            ? [
                {
                  label: "CPF",
                  value: formatCpf(student.cpf),
                  icon: "badge",
                },
                {
                  label: "Prefeitura",
                  value: student.prefecture.name,
                  icon: "account-balance",
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
                  title="Editar perfil"
                  subtitle="Atualize nome, e-mail e CPF"
                  icon="edit"
                  onPress={() => router.push("/(private)/students/profile/edit")}
                />
                <ProfileActionItem
                  title="Trocar prefeitura"
                  subtitle="Solicite mudança de rede municipal"
                  icon="sync-alt"
                  onPress={() => router.push("/(private)/students/profile/prefecture")}
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
        error={error}
        onCancel={() => setDeleteConfirmationVisible(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}

export default StudentProfileScreen;
