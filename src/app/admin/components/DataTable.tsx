"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utilities/global";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  route: string;
  rowKey?: string;
}
//id,firstname,totalorders,datejoined,role,email
export function DataTable<TData, TValue>({
  columns,
  data,
  route,
  rowKey,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    router.push(
                      `/admin/${route}/` +
                        row
                          .getVisibleCells()
                          .find((cell) => cell.column.id === (rowKey || "id"))
                          ?.getContext()
                          .getValue()
                    )
                  }
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: any) => {
                    //  console.log(cell.column);
                    return (
                      <TableCell key={cell.id} className="cursor-pointer">
                        {cell.column.id === "orders" ? (
                          // <p className="font-italic text-gray-500 text-sm text-center">
                          cell?.getContext()?.getValue()?.length
                        ) : cell.getContext().getValue() &&
                          typeof cell?.getContext()?.getValue()[0] ===
                            "object" ? (
                          <p className="font-italic text-gray-500 text-sm text-center">
                            {"Array,click to view"}
                          </p>
                        ) : cell.column.id === "createdAt" ? (
                          <p className="font-italic text-gray-500 text-sm text-center">
                            {formatDate(cell.getContext()?.getValue())}
                          </p>
                        ) : (
                          // </p>
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
