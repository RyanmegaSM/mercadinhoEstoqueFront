import { parseDate } from "@/helpers/parse-date";

interface ExpiringBatch {
  id: number;
  productName: string;
  loteId: number;
  validade: string; // ISO date
  quantidade: number;
  fornecedor: string;
}

interface ExpiringListProps {
  items: ExpiringBatch[];
}

export function ExpiringList({ items }: ExpiringListProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Nenhum lote próximo do vencimento
      </div>
    );
  }

  return (
    <ul className="space-y-2 p-2">
      {items.map((item, i) => (
        <li
          key={item.loteId + i + "s"}
          className="flex justify-between items-center border rounded p-2"
        >
          <div>
            <div className="text-sm font-medium">{item.productName}</div>
            <div className="text-xs text-muted-foreground">
              {item.fornecedor} • Lote #{item.loteId}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">
              {parseDate(item.validade)}
            </div>
            <div className="text-xs text-muted-foreground">
              Qtd: {item.quantidade}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
