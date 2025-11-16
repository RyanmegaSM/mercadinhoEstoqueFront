import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { Card } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getProductsBySupplier } from "@/services/products";
import { createBatch } from "@/services/batches";
import { getSupplierById } from "@/services/suppliers";

import { createBatchSchema } from "@/validations/batch-schema";

import { formatDate } from "@/helpers/format-date";
import { centavosToReais } from "@/helpers/convert-centavos-to-reais";
import { reaisToCentacos } from "@/helpers/convert-reais-to-centavos";

interface SelectedProducts {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: string;
}

export function AddBatchPage() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>(
    []
  );

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productCount, setProductCount] = useState(0);
  const [batchPrice, setBatchPrice] = useState("");
  const navigate = useNavigate();

  const { supplierId } = useParams() as { supplierId: string };

  const { data: supplier } = useQuery({
    queryKey: ["suppliers", supplierId],
    queryFn: async () => {
      const response = await getSupplierById(Number(supplierId));
      return response;
    },
  });

  const dependentId = supplier?.id;

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-by-supplier", dependentId],
    queryFn: async () => {
      if (!dependentId) return;
      const response = await getProductsBySupplier(dependentId);

      return response.map((item) => ({
        id: item.id,
        name: item.nome,
        valor: item.precoUnitario,
      }));
    },
    initialData: [],
    enabled: !!dependentId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createBatchSchema),
  });

  const handleAddProduct = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!selectedProductId) return;

    if (productCount <= 0) {
      toast.warning(`Quantidade de produtos não pode ser igual a 0`);
      return;
    }

    const productAlreadyOnList = selectedProducts.find(
      (item) => item.id === Number(selectedProductId)
    );

    if (productAlreadyOnList) {
      toast.warning(`${productAlreadyOnList.nome} já está na lista`);
      return;
    }

    const product = products?.find(
      (item) => item.id === Number(selectedProductId)
    );

    if (!product) return;

    setSelectedProducts((prev) => [
      ...prev,
      {
        id: product.id,
        nome: product.name,
        quantidade: productCount,
        precoUnitario: centavosToReais(product.valor),
      },
    ]);
    setProductCount(0);
  };

  const handleRemoveProduct = (id: number) => {
    setSelectedProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const calcBatchTotalPrice = () => {
    const valorTotal = selectedProducts.reduce((acc, item) => {
      const valorTotalProduto =
        item.quantidade * reaisToCentacos(item.precoUnitario.replace("R$", ""));
      return acc + valorTotalProduto;
    }, 0);

    return valorTotal;
  };

  const handleCreateBatch = async (data: z.infer<typeof createBatchSchema>) => {
    try {
      if (selectedProducts.length === 0) {
        toast.error("Adicione ao menos um produto.");
        return;
      }

      const newBatch = {
        price: calcBatchTotalPrice(),
        validity: formatDate(data.validity),
        supplierId: supplier!.id,
        quantity: selectedProducts.reduce(
          (acc, product) => acc + product.quantidade,
          0
        ),
        products: selectedProducts.map((product) => ({
          id: product.id,
          quantidade: product.quantidade,
        })),
      };

      await createBatch(newBatch);
      toast.success("Lote criado com sucesso.");
      navigate("/suppliers");
    } catch (error) {
      toast.error(`Erro ao salvar lote: ${error}`);
    }
  };

  useEffect(() => {
    if (!supplier) return;
    reset({ supplier: supplier.nome });
  }, [supplier]);

  useEffect(() => {
    const productAmount = calcBatchTotalPrice();
    setBatchPrice(centavosToReais(productAmount));
  }, [selectedProducts]);

  return (
    <Card title="Novo lote" actions={[]}>
      <form onSubmit={handleSubmit(handleCreateBatch)}>
        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3 ">
            <label>Fornecedor</label>
            <Input
              placeholder="Nome do produto"
              className="mt-1"
              {...register("supplier")}
              disabled
            />
            {errors.supplier && (
              <span className="text-sm text-red-500">
                {errors.supplier.message}
              </span>
            )}
          </section>
          <section className="w-1/2 p-3">
            <label>Quantidade total</label>
            <Input
              value={selectedProducts.reduce(
                (acc, product) => acc + product.quantidade,
                0
              )}
              placeholder="Descrição do produto"
              className="mt-1"
              disabled
            />
          </section>
        </div>

        <div className="flex items-center justify-around">
          <section className="w-1/2 p-3">
            <label>Preço</label>
            <Input
              placeholder="Informe um valor"
              className="mt-1"
              disabled
              value={batchPrice}
            />
          </section>

          <section className="w-1/2 p-3">
            <label>Validade</label>
            <Input
              placeholder="Informe uma data"
              className="mt-1"
              {...register("validity")}
            />
            {errors.validity && (
              <span className="text-sm text-red-500">
                {errors.validity.message}
              </span>
            )}
          </section>
        </div>

        <div className="border-t mt-2 w-full" />

        <div className="flex items-center justify-around">
          <section className="w-1/2 p-3">
            <label>Produtos</label>
            <Select
              onValueChange={setSelectedProductId}
              value={selectedProductId}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full min-w-[250px]">
                <SelectValue
                  placeholder={
                    isLoading
                      ? "Carregando produtos..."
                      : "Selecione uma produto"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {products?.map((prod) => (
                  <SelectItem key={prod.id} value={String(prod.id)}>
                    {prod.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <section className="w-1/2 p-3">
            <label>Quantidade</label>
            <Input
              value={productCount}
              onChange={(e) => setProductCount(Number(e.target.value))}
            />
          </section>

          <section className="flex items-center justify-around">
            <Button onClick={handleAddProduct} className="mt-6" type="button">
              Adicionar
            </Button>
          </section>
        </div>

        <DataTable
          data={selectedProducts}
          columns={[
            {
              key: "nome",
              label: "Nome",
            },
            {
              key: "quantidade",
              label: "Quantidade",
            },
            {
              key: "precoUnitario",
              label: "Preço Unitário",
            },
          ]}
          actions={[
            {
              label: "Excluir",
              icon: Trash,
              onClick: (item) => handleRemoveProduct(item.id),
            },
          ]}
        />

        <div className="flex gap-2 justify-end mt-4 px-3 border-t pt-6">
          <Button
            type="button"
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => navigate("/suppliers")}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  );
}
