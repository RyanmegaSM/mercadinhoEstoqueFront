import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/card";
import { DataTable } from "@/components/table";
import { ConfirmDialog } from "@/components/dialog";

import {
  deleteStockMovimentation,
  getStockMovimentation,
} from "@/services/stockMovimentation";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function StockMovimentationPage() {
  const [pagination, setPagination] = useState<PaginationProps>();
  const [page, setPage] = useState(1);
  const [movimentarionId, setMovimentationId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const queryClient = useQueryClient();

  const pageSize = 5;

  const { data: stockMovimentation, isLoading } = useQuery({
    queryKey: ["stockMovimentation", page, pageSize],
    queryFn: async () => {
      const response = await getStockMovimentation({ page, pageSize });
      const { data } = response;

      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        page: response.currentPage,
        pageSize: response.pageSize,
      });

      return data.map((item) => ({
        id: item.id,
        data: new Date(item.data).toLocaleDateString("pt-Br"),
        tipo: item.tipo,
        quantidade: item.quantidade,
        produto: item.produtos.map((prod) => prod.nome).join(", "),
        usuario: item.usuario,
      }));
    },
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: async (id: number) => {
      await deleteStockMovimentation(id);
    },
    onSuccess: () => {
      toast.success("Produto removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["stockMovimentation"] });
      setOpenDialog(false);
      setMovimentationId(null);
    },
    onError: () => {
      toast.error("Falha ao remover produto. Tente mais tarde.");
      setOpenDialog(false);
      setMovimentationId(null);
    },
  });

  const handleDeleteStockMovimentation = async () => {
    if (!movimentarionId) return;

    await deleteMutation(movimentarionId);
  };

  if (!stockMovimentation) {
    return <p>Não há movimentações</p>;
  }

  return (
    <>
      <Card title="Movimentações" actions={[]}>
        <section className="flex gap-4 mb-6">
          <div>
            <label htmlFor="">Produto</label>
            <Input type="text" placeholder="Buscar movimentação..." />
          </div>
          <div>
            <label htmlFor="">Usuario</label>
            <Input type="text" placeholder="Buscar movimentação..." />
          </div>
        </section>

        {isLoading ? (
          <p> carregando... </p>
        ) : (
          <section className="border-t pt-6">
            <DataTable
              data={stockMovimentation}
              columns={[
                { key: "data", label: "Data" },
                { key: "tipo", label: "Tipo" },
                { key: "quantidade", label: "Quantidade" },
                { key: "produto", label: "Produto" },
                { key: "usuario", label: "Usuario" },
              ]}
              actions={[
                {
                  label: "Excluir",
                  icon: Trash,
                  onClick: (item) => {
                    setOpenDialog(true);
                    setMovimentationId(item.id);
                  },
                },
              ]}
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
        title="Remover movimentação"
        description="Deseja realmente remover esta movimentação? A operação não pode ser desfeita."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteStockMovimentation}
      />
    </>
  );
}
