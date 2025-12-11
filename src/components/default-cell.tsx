import { Cell, flexRender } from "@tanstack/react-table";
import { TableCell } from "./ui/table";
import { cn } from "@/lib/utils";

export function DefaultCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  const isPinned = cell.column.getIsPinned();

  return (
    <TableCell
      key={cell.id}
      className={cn(
        "p-1 px-2",
        cell.column.id !== "select" && cell.column.id !== "add-column"
          ? "border-r"
          : "",
        isPinned
          ? "flex items-center sticky z-10 bg-background group-hover:bg-muted group-data-[state=selected]:bg-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r-2 border-r-border border-b border-border"
          : "",
        cell.column.id === "select" ? "border-r-0" : ""
      )}
      style={{
        width: cell.column.getSize(),
        flex: `0 0 ${cell.column.getSize()}px`,
        left:
          isPinned === "left" ? `${cell.column.getStart("left")}px` : undefined,
      }}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block text-[13px] font-normal text-[#333333">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
    </TableCell>
  );
}
