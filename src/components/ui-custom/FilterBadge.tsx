import { cn } from "@/lib/utils";

interface FilterBadgeProps {
  header: string;
  text: string;
  variant?: "auto-width" | "selected";
  onRemove?: () => void;
  onExpand?: () => void;
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 2.5h12M3 7h8M5 11.5h4" stroke="#929292" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l4 4 4-4" stroke="#929292" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterBadge({ header, text, variant, onRemove, onExpand }: FilterBadgeProps) {
  return (
    <button
      onClick={onExpand}
      className={cn(
        "inline-flex items-center gap-1.5 h-[27px] rounded-[4px]",
        "text-[#515358] cursor-pointer",
        "pt-[4px] pr-[16px] pb-[4px] pl-[7px]",
        variant === "selected" ? "bg-[#CECECE]" : "bg-[#E5E5E5]",
        variant !== "auto-width" && variant !== "selected" && "w-[354px]"
      )}
      type="button"
    >
      <FilterIcon />
      <span className="font-bold text-[15px]">{header}</span>
      <span className="font-medium text-[15px]">{text}</span>
      <span className="ml-auto">
        <ChevronDownIcon />
      </span>
      {onRemove && (
        <span
          role="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-1 text-[#515358] leading-none"
        >
          ×
        </span>
      )}
    </button>
  );
}
