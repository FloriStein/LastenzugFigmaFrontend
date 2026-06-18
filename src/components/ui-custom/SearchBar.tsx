import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "default" | "small";
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="4" stroke="#646A79" strokeWidth="1.2" />
      <path d="M8.5 8.5L11 11" stroke="#646A79" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchBar({ value, onChange, placeholder, size = "default" }: SearchBarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center bg-[#F5F7F8] border border-[#646A79] rounded-[10px]",
        size === "small" ? "w-74.5 h-6.75" : "w-88.25 h-8"
      )}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent outline-none pr-8",
          "font-medium text-[15px] text-[#646A79] placeholder:text-[#646A79] pl-3.75"
        )}
      />
      <span className="absolute right-3 flex items-center pointer-events-none">
        <SearchIcon />
      </span>
    </div>
  );
}
