import { Input } from "@/components/ui/input";

interface SortFieldSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortFieldSearch({ value, onChange }: SortFieldSearchProps) {
  return (
    <div>
      <Input
        placeholder="Search fields"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
      />
    </div>
  );
}
