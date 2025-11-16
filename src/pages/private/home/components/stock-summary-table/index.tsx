import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { centavosToReais } from "@/helpers/convert-centavos-to-reais";

export interface StockSummary {
  id: number;
  nome: string;
  totalQuantidade: number;
  precoUnitarioCentavos: number;
  totalValorCentavos: number;
}

interface StockSummaryTableProps {
  rows: StockSummary[];
}

export function StockSummaryTable({ rows }: StockSummaryTableProps) {
  return (
    <Table>
      <TableCaption>Resumo do estoque por produto</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Valor unit.</TableHead>
          <TableHead className="text-right">Valor total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.nome}</TableCell>
            <TableCell className="text-right">{r.totalQuantidade}</TableCell>
            <TableCell className="text-right">
              {centavosToReais(r.precoUnitarioCentavos)}
            </TableCell>
            <TableCell className="text-right">
              {centavosToReais(r.totalValorCentavos)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
