import { flexRender, Header } from "@tanstack/react-table";
import { TableHead } from "./ui/table";
import { cn } from "@/lib/utils";

export function DefaultHeader<TData>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  const isPinned = header.column.getIsPinned();

  return (
    <TableHead
      key={header.column.id}
      colSpan={header.colSpan}
      className={cn(
        "relative flex items-center bg-background p-1 px-2",
        header.id !== "add-column" && header.id !== "select" ? "border-r" : "",
        isPinned
          ? "sticky z-30 border-r-2 border-r-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
          : "",
        header.id === "select" ? "border-r-0" : ""
      )}
      style={{
        width: header.column.getSize(),
        flex: `0 0 ${header.column.getSize()}px`,
        left:
          isPinned === "left"
            ? `${header.column.getStart("left")}px`
            : undefined,
      }}
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-[#999999] text-[13px] font-medium">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      {header.column.id !== "select" && (
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={(e) => {
            header.getResizeHandler()(e);
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            header.getResizeHandler()(e);
            e.stopPropagation();
          }}
          className={`absolute right-0 top-0 h-full w-[5px] hover:bg-primary/50 cursor-col-resize select-none touch-none transition-colors z-40 ${
            header.column.getIsResizing() ? "bg-primary" : "bg-transparent"
          }`}
        />
      )}
    </TableHead>
  );
}
