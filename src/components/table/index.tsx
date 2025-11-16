import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T]) => React.ReactNode;
}

export interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  caption?: string;
  pagination?: PaginationProps;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  actions,
  caption,
  pagination,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  return (
    <>
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
            {actions && actions.length > 0 && (
              <TableHead className="w-10 text-center">Ações</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(row[column.key])
                      : String(row[column.key])}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell className="flex gap-2 justify-end">
                    {actions.map(({ label, onClick, icon: Icon }) => (
                      <Button
                        key={label}
                        size={"sm"}
                        variant={"ghost"}
                        onClick={() => onClick(row)}
                        className="cursor-pointer"
                      >
                        {Icon && <Icon className="w-4 h-4 mr-1" />}
                      </Button>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={actions ? columns.length + 1 : columns.length}
                className="font-semibold text-center"
              >
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex justify-end items-center gap-2 mt-2">
          <Button
            size={"sm"}
            variant={"outline"}
            disabled={pagination.page === 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm">
            Página {pagination.page} de {totalPages}
          </span>
          <Button
            size={"sm"}
            variant={"outline"}
            disabled={pagination.page === totalPages}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
          >
            Próxima
          </Button>
        </div>
      )}
    </>
  );
}
