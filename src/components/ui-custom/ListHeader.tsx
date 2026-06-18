import { cn } from "@/lib/utils";

interface ListHeaderProps {
  label: string;
  sort?: "none" | "asc" | "desc";
  onSort?: () => void;
}

function ChevronUp() {
  return (
    <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4.5L4.5 1 8 4.5" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0.5L4.5 4 8 0.5" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ListHeader({ label, sort = "none", onSort }: ListHeaderProps) {
  return (
    <button
      onClick={onSort}
      className={cn(
        "inline-flex items-center gap-3 font-semibold text-[15px] text-black",
        onSort ? "cursor-pointer" : "cursor-default"
      )}
      type="button"
    >
      {label}
      {sort === "asc" && <ChevronUp />}
      {sort === "desc" && <ChevronDown />}
    </button>
  );
}
