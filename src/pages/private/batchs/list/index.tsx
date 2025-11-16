import { useState } from "react";
import { useForm } from "react-hook-form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { useNavigate } from "react-router";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/card";
import { DataTable } from "@/components/table";

import { getBatches } from "@/services/batches";
import { formatToBRLDate } from "@/helpers/format-to-brl-date";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const filterBatchesSchema = z.object({
  validity: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data inválida. Use o formato dd/mm/yyyy."
    ),
});

export function BatchesPage() {
  const [pagination, setPagination] = useState<PaginationProps>();
  const [page, setPage] = useState(1);
  const [validityFilter, setValidityFilter] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(filterBatchesSchema),
  });

  const pageSize = 5;

  const { data: batches, isLoading } = useQuery({
    queryKey: ["batches", page, pageSize, validityFilter],
    queryFn: async () => {
      const response = await getBatches({
        page,
        pageSize,
        validity: validityFilter,
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
        quantidade: item.quantidade,
        validade: formatToBRLDate(item.validade),
        fornecedor: item.fornecedor.nome,
      }));
    },
    placeholderData: keepPreviousData,
  });

  if (!batches) {
    return <p>Não há produtos</p>;
  }

  return (
    <>
      <Card title="Lotes" actions={[]}>
        <form className="flex items-center gap-4 ">
          <div>
            <label htmlFor="">Validade: </label>
            <Input
              type="text"
              placeholder="Buscar lote..."
              {...register("validity")}
            />
          </div>
          <Button
            className="self-end"
            onClick={handleSubmit((data) => {
              setValidityFilter(data.validity);
            })}
          >
            Filtrar
          </Button>
        </form>
        <div className="h-0.5 mb-9">
          {errors.validity && (
            <span className="text-sm text-red-500">
              {errors.validity.message}
            </span>
          )}
        </div>

        {isLoading ? (
          <p> carregando... </p>
        ) : (
          <section className="border-t pt-6">
            <DataTable
              data={batches}
              columns={[
                { key: "id", label: "id" },
                { key: "quantidade", label: "Quantidade" },
                { key: "validade", label: "Validade" },
                { key: "fornecedor", label: "Fornecedor" },
              ]}
              actions={[
                {
                  label: "Detalhes",
                  icon: ReceiptText,
                  onClick: (item) => navigate(`/batches/details/${item.id}`),
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
    </>
  );
}
