import { Cell, flexRender } from "@tanstack/react-table";
import { TableCell } from "./ui/table";
import { cn } from "@/lib/utils";

export function DefaultCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  return (
    <TableCell
      key={cell.id}
      className={cn(
        cell.column.id !== "select" && cell.column.id !== "add-column"
          ? "border-r"
          : ""
      )}
      style={{
        width: cell.column.getSize(),
        flex: `0 0 ${cell.column.getSize()}px`,
      }}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
    </TableCell>
  );
}
