import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Edit, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/card";
import { DataTable } from "@/components/table";
import { ConfirmDialog } from "@/components/dialog";

import { deleteProduct, getProducts } from "@/services/products";
import { centavosToReais } from "@/helpers/convert-centavos-to-reais";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function ProductsPage() {
  const [pagination, setPagination] = useState<PaginationProps>();
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const debouncedName = useDebounce(nameFilter, 500);
  const debouncedCategory = useDebounce(categoryFilter, 500);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const pageSize = 5;

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", page, pageSize, debouncedCategory, debouncedName],
    queryFn: async () => {
      const response = await getProducts({
        page,
        pageSize,
        name: debouncedName || undefined,
        category: debouncedCategory || undefined,
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
        descricao: item.descricao,
        precoUnitario: centavosToReais(item.precoUnitario),
        categoria: item.Categoria.nome,
      }));
    },
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: async (id: number) => {
      await deleteProduct(id);
    },
    onSuccess: () => {
      toast.success("Produto removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // atualiza lista
      setOpenDialog(false);
      setProductId(null);
    },
    onError: () => {
      toast.error("Falha ao remover produto. Tente mais tarde.");
      setOpenDialog(false);
      setProductId(null);
    },
  });

  const handleDeleteProduct = async () => {
    if (!productId) return;

    await deleteMutation(productId);
  };

  if (!products) {
    return <p>Não há produtos</p>;
  }

  return (
    <>
      <Card
        title="Produtos"
        actions={[
          {
            label: "Adicionar",
            icon: PlusCircle,
            onClick: () => {
              navigate("/products/add");
            },
          },
        ]}
      >
        <section className="flex gap-4 mb-6">
          <div>
            <label htmlFor="nameFilter" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="nameFilter"
              type="text"
              placeholder="Buscar produto..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-64"
            />
          </div>

          <div>
            <label htmlFor="categoryFilter" className="text-sm font-medium">
              Categoria
            </label>
            <Input
              id="categoryFilter"
              type="text"
              placeholder="Buscar categoria..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-64"
            />
          </div>
        </section>

        {isLoading ? (
          <p> carregando... </p>
        ) : (
          <section className="border-t pt-6">
            <DataTable
              data={products}
              columns={[
                { key: "nome", label: "Nome" },
                { key: "precoUnitario", label: "Preço" },
                { key: "categoria", label: "Categoria" },
              ]}
              actions={[
                {
                  label: "Editar",
                  icon: Edit,
                  onClick: (item) => navigate("/products/edit/" + item.id),
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
        title="Remover produto"
        description="Deseja realmente remover este produto? A operação não pode ser desfeita."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteProduct}
      />
    </>
  );
}
