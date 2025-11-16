import { useState } from "react";
import { useQueries, keepPreviousData } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "./components/stat-card";
import { ExpiringList } from "./components/expiring-list";
import { LowStockList } from "./components/low-stock-list";
import { StockSummaryTable } from "./components/stock-summary-table";
import {
  getExpiringBatches,
  getLowStockProducts,
  getStockSummary,
  getTotalProductAmount,
  getTotalProducts,
} from "@/services/dashboard";
import { centavosToReais } from "@/helpers/convert-centavos-to-reais";
import { transformBatches } from "@/helpers/transform-batches";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate } from "react-router";

export function DashboardPage() {
  const [limitDays, setLimitDays] = useState(15);
  const [threshold, setThreshold] = useState(20);

  const navigate = useNavigate();

  const debouncedThreshold = useDebounce(threshold, 1000);
  const debouncedLimit = useDebounce(limitDays, 1000);

  const results = useQueries({
    queries: [
      {
        queryKey: ["expiring-batches", debouncedLimit],
        queryFn: async () => {
          const response = await getExpiringBatches(debouncedLimit);
          return response;
        },
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ["total-products"],
        queryFn: async () => {
          const response = await getTotalProducts();
          return response;
        },
      },
      {
        queryKey: ["total-amount"],
        queryFn: async () => {
          const response = await getTotalProductAmount();
          const formattedAmount = centavosToReais(response.amount);
          return formattedAmount;
        },
      },
      {
        queryKey: ["low-stock", debouncedThreshold],
        queryFn: async () => {
          const response = await getLowStockProducts(debouncedThreshold);

          const lowStock = {
            products: response.products.map((item) => ({
              id: item.produto.id,
              nome: item.produto.nome,
              quantidade: item.quantidade,
              minThreshold: debouncedThreshold,
            })),
            total: response.total,
          };

          return lowStock;
        },
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ["stock-summary"],
        queryFn: async () => {
          return await getStockSummary();
        },
      },
    ],
  });

  const [expiring, totalProducts, totalAmount, lowStockProducts, stcokSummary] =
    results;

  if (results.some((r) => r.isLoading)) return <p>Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Lotes a vencer"
          value={expiring.data?.total}
          subTitle={`Corte: ${limitDays} dias`}
        />
        <StatCard
          title="Produtos em reposição"
          value={lowStockProducts.data?.total}
          subTitle={`Mínimo: ${threshold} unidades`}
        />
        <StatCard
          title="Unidades no estoque"
          value={totalProducts.data?.totalProducts}
          subTitle="Total unidades"
        />
        <StatCard title="Valor total do estoque" value={totalAmount.data} />
      </section>

      <section className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <label className="text-sm">Corte vencimento (dias)</label>
          <Input
            className="w-24"
            value={limitDays}
            onChange={(e) => setLimitDays(Number(e.target.value))}
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm">Limite de reposição</label>
          <Input
            className="w-24"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
        </div>

        <div>
          <Button
            onClick={() => {
              setLimitDays(15);
              setThreshold(20);
            }}
          >
            Reset
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold mb-2">Resumo de estoque</h3>
            <StockSummaryTable rows={stcokSummary.data ?? []} />
          </div>

          <div className="rounded-xl border bg-card p-4">
            <h3
              className="font-semibold mb-2
            "
            >
              Lotes vencidos ou próximos do vencimento
            </h3>
            <ExpiringList
              items={transformBatches(expiring.data?.batches ?? [])}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold mb-2">Produtos em reposição</h3>
            <LowStockList items={lowStockProducts.data?.products ?? []} />
          </div>

          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold mb-2">Ações rápidas</h3>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate("/suppliers")}>
                Gerar pedido de compra
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
