export interface LowStockProduct {
  id: number;
  nome: string;
  quantidade: number;
  minThreshold?: number;
}

interface LowStockListProps {
  items: LowStockProduct[];
}

export function LowStockList({ items }: LowStockListProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Nenhum produto com estoque baixo
      </div>
    );
  }

  return (
    <ul className="space-y-2 p-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex justify-between items-center border rounded p-2"
        >
          <div>
            <div className="text-sm font-medium"> {item.nome} </div>
            <div className="text-xs text-muted-foreground">
              {item.minThreshold ?? "-"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">{item.quantidade}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
