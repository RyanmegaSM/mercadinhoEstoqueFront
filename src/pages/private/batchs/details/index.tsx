import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table";

import { detailsBatchSchema } from "@/validations/batch-schema";
import { getBatchById } from "@/services/batches";

import { centavosToReais } from "@/helpers/convert-centavos-to-reais";
import { parseDate } from "@/helpers/parse-date";

interface SelectedProducts {
  id: number;
  nome: string;
  quantidade: number;
}

export function DetailsBatchPage() {
  const [products, setProducts] = useState<SelectedProducts[]>([]);

  const navigate = useNavigate();

  const { id } = useParams() as { id: string };

  const { data, isLoading } = useQuery({
    queryKey: ["batch", id],
    queryFn: async () => {
      const response = await getBatchById(Number(id));

      return response;
    },
  });

  const { register, reset } = useForm({
    resolver: zodResolver(detailsBatchSchema),
  });

  useEffect(() => {
    if (!data) return;
    reset({
      supplier: data.fornecedor,
      validity: parseDate(data.validade),
      price: centavosToReais(data.preco),
      totalProducts: data.quantidade,
    });

    setProducts(
      data.produtos.map((p, i) => ({
        nome: p.nome,
        quantidade: p.quantidade,
        id: i + 1,
      }))
    );
  }, [data, reset]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <Card title="Detalhes do lote" actions={[]}>
      <form>
        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3 ">
            <label>Fornecedor</label>
            <Input
              placeholder="Nome do produto"
              className="mt-1"
              {...register("supplier")}
              disabled
            />
          </section>
          <section className="w-1/2 p-3">
            <label>Quantidade total</label>
            <Input
              placeholder="Descrição do produto"
              className="mt-1"
              {...register("totalProducts")}
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
              {...register("price")}
              disabled
            />
          </section>

          <section className="w-1/2 p-3">
            <label>Validade</label>
            <Input
              placeholder="Informe uma data"
              className="mt-1"
              {...register("validity")}
              disabled
            />
          </section>
        </div>

        <div className="border-t mt-2 w-full" />

        <DataTable
          data={products}
          columns={[
            {
              key: "nome",
              label: "Nome",
            },
            {
              key: "quantidade",
              label: "Quantidade",
            },
          ]}
          actions={[]}
        />

        <div className="flex gap-2 justify-end mt-4 px-3 border-t pt-6">
          <Button
            type="button"
            className="cursor-pointer"
            variant={"default"}
            onClick={() => navigate("/batches")}
          >
            Voltar
          </Button>
        </div>
      </form>
    </Card>
  );
}
