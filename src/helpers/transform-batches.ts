import type { ApiBatch } from "@/interfaces/dashboard";

export function transformBatches(apiBatches: ApiBatch[]) {
  return apiBatches.flatMap((batch) =>
    batch.produtos.map((produto) => ({
      id: produto.id,
      productName: produto.nome,
      loteId: batch.id,
      validade: batch.validade,
      quantidade: produto.quantidade,
      fornecedor: batch.fornecedor,
    }))
  );
}
