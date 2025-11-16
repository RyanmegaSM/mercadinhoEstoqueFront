import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Edit, PlusCircle, Trash, PackagePlus } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/card";
import { DataTable, type Action } from "@/components/table";
import { ConfirmDialog } from "@/components/dialog";

import { getSuppliers, deleteSupplier } from "@/services/suppliers";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/contexts/auth/use-auth";
import type { Supplier } from "@/interfaces/supplier";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function SuppliersPage() {
  const [pagination, setPagination] = useState<PaginationProps>();
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [cnpjFilter, setCnpjFilter] = useState("");

  const { user } = useAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const pageSize = 5;

  const debouncedName = useDebounce(nameFilter, 500);
  const debouncedCnpj = useDebounce(cnpjFilter, 500);

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["suppliers", page, pageSize, debouncedCnpj, debouncedName],
    queryFn: async () => {
      const response = await getSuppliers({
        page,
        pageSize,
        name: debouncedName || undefined,
        cnpj: debouncedCnpj || undefined,
      });
      const { data } = response;

      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        page: response.currentPage,
        pageSize: response.pageSize,
      });

      return data.map((item) => ({
        id: item.id,
        nome: item.nome,
        telefone: item.telefone,
        endereco: item.endereco,
        cnpj: item.cnpj,
      }));
    },
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: async (id: number) => {
      await deleteSupplier(id);
    },
    onSuccess: () => {
      toast.success("Fornecedor removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setOpenDialog(false);
      setSupplierId(null);
    },
    onError: (error) => {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Falha ao remover fornecedor. Tente mais tarde.");
      }

      setOpenDialog(false);
      setSupplierId(null);
    },
  });

  if (!suppliers) {
    return <p>Não há fornecedores</p>;
  }

  const renderPhone = (value: string | number) => {
    const phone = String(value).replace(/\D/g, "");
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  const renderCNPJ = (value: string | number) => {
    const cnpj = String(value).replace(/\D/g, "");
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  async function handleDeleteSupplier() {
    if (!supplierId) return;

    await deleteMutation(supplierId);
  }

  const cardActions =
    user?.accessType === 3
      ? []
      : [
          {
            label: "Adicionar",
            icon: PlusCircle,
            onClick: () => {
              navigate("/suppliers/add");
            },
          },
        ];

  const supplierActions: Action<Supplier>[] =
    user?.accessType === 3
      ? [
          {
            label: "Novo lote",
            icon: PackagePlus,
            onClick: (item) => navigate(`/suppliers/add-batch/${item.id}`),
          },
        ]
      : [
          {
            label: "Novo lote",
            icon: PackagePlus,
            onClick: (item) => navigate(`/suppliers/add-batch/${item.id}`),
          },
          {
            label: "Editar",
            icon: Edit,
            onClick: (item) => navigate(`/suppliers/edit/${item.id}`),
          },
          {
            label: "Excluir",
            icon: Trash,
            onClick: (item) => {
              setOpenDialog(true);
              setSupplierId(item.id);
            },
          },
        ];

  return (
    <>
      <Card title="Fornecedores" actions={cardActions}>
        <section className="flex gap-4 mb-6">
          <div>
            <label htmlFor="">Nome </label>
            <Input
              type="text"
              placeholder="Buscar fornecedor..."
              value={nameFilter}
              onChange={(e) => {
                setNameFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label htmlFor="">CNPJ</label>
            <Input
              type="text"
              placeholder="Buscar fornecedor..."
              value={cnpjFilter}
              onChange={(e) => {
                setCnpjFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </section>

        {isLoading ? (
          <p> carregando... </p>
        ) : (
          <section className="border-t pt-6">
            <DataTable
              data={suppliers}
              columns={[
                { key: "nome", label: "Nome" },
                {
                  key: "telefone",
                  label: "Telefone",
                  render: (value) => renderPhone(value),
                },
                { key: "endereco", label: "Endereço" },
                {
                  key: "cnpj",
                  label: "CNPJ",
                  render: (value) => renderCNPJ(value),
                },
              ]}
              actions={supplierActions}
              pagination={{
                page: pagination?.page ?? page,
                pageSize: pagination?.pageSize ?? 1,
                total: pagination?.total ?? 0,
                onPageChange: setPage,
              }}
            />
          </section>
        )}
      </Card>
      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Remover fornecedor"
        description="Deseja realmente remover este fornecedor? A operação não pode ser desfeita."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteSupplier}
      />
    </>
  );
}
