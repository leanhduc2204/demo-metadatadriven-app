import { flexRender, Header } from "@tanstack/react-table";
import { TableHead } from "./ui/table";
import { cn } from "@/lib/utils";

export function DefaultHeader<TData>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  const resizeHandler = header.getResizeHandler();

  return (
    <TableHead
      key={header.column.id}
      colSpan={header.colSpan}
      className={cn(
        "relative font-semibold text-left p-2 bg-background",
        header.id !== "add-column" && header.id !== "select" ? "border-r" : ""
      )}
      style={{
        width: header.column.getSize(),
        flex: `0 0 ${header.column.getSize()}px`,
      }}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-gray-500">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      {header.column.id !== "select" && (
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={resizeHandler}
          onTouchStart={resizeHandler}
          className={`absolute right-0 top-0 h-full w-[5px] hover:bg-primary/20 transition-colors duration-200  select-none ${
            header.column.getIsResizing() ? "bg-secondary" : ""
          }`}
          style={{ cursor: "col-resize", touchAction: "none" }}
        />
      )}
    </TableHead>
  );
}
