import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Trash } from "lucide-react";
import { toast } from "sonner";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

import { Card } from "@/components/card";
import { DataTable } from "@/components/table";
import { ConfirmDialog } from "@/components/dialog";

import { getUsers, deleteUser, getAccessTypeLabel } from "@/services/users";

export function UsersPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationProps>();
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: async () => {
      const response = await getUsers({
        page,
        pageSize,
      });
      const { data } = response;

      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        page: response.currentPage,
        pageSize: response.pageSize,
      });

      return data.map((user) => ({
        id: user.id,
        nome: user.name,
        email: user.email,
        tipo: getAccessTypeLabel(user.accessType),
      }));
    },
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: async (id: number) => {
      await deleteUser(id);
    },
    onSuccess: () => {
      toast.success("Usuário removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpenDialog(false);
      setUserId(null);
    },
    onError: (error) => {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Falha ao remover usuário. Tente mais tarde.");
      }
      setOpenDialog(false);
      setUserId(null);
    },
  });

  async function handleDeleteUser() {
    if (!userId) return;
    await deleteMutation(userId);
  }

  if (!users) {
    return <p>Não há usuários cadastrados</p>;
  }

  return (
    <>
      <Card
        title="Usuários"
        actions={[
          {
            label: "Adicionar",
            icon: PlusCircle,
            onClick: () => {
              navigate("/users/add");
            },
          },
        ]}
      >
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            data={users}
            columns={[
              { key: "nome", label: "Nome" },
              { key: "email", label: "Email" },
              { key: "tipo", label: "Tipo de Acesso" },
            ]}
            actions={[
              {
                label: "Excluir",
                icon: Trash,
                onClick: (item) => {
                  setOpenDialog(true);
                  setUserId(item.id);
                },
              },
            ]}
            pagination={{
              page: pagination?.page ?? page,
              pageSize: pagination?.pageSize ?? pageSize,
              total: pagination?.total ?? 0,
              onPageChange: setPage,
            }}
          />
        )}
      </Card>

      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Remover usuário"
        description="Deseja realmente remover este usuário? A operação não pode ser desfeita."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteUser}
      />
    </>
  );
}
