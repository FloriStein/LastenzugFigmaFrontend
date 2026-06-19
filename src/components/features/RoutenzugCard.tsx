import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import type { FahrtStatus } from "@/types/routenzug";

interface RoutenzugCardProps {
  name: string;
  aufträge: string[];
  status: FahrtStatus;
  ladestand?: number;
  onClick?: () => void;
}

export function RoutenzugCard({ name, aufträge, status, ladestand, onClick }: RoutenzugCardProps) {
  const aufträgeText =
    aufträge.length > 0
      ? `Lieferungen: ${aufträge.join(", ")}`
      : "keine Lieferungen";

  return (
    <div
      className={cn(
        "relative bg-[rgba(255,255,255,0.9)] rounded-[10px]",
        "w-[437px] h-[111px]",
        onClick && "cursor-pointer hover:bg-white transition-colors"
      )}
      onClick={onClick}
    >
      <span className="absolute left-[23px] top-[12px] font-bold text-[20px] text-black leading-6">
        {name}
      </span>

      <span className="absolute left-[228px] top-[10px]">
        <StatusBadge type={status} percent={status === "lädt" ? ladestand : undefined} />
      </span>

      <span
        className={cn(
          "absolute left-[23px] top-[68px] font-medium text-[20px] leading-6",
          aufträge.length === 0 ? "text-[#353535]" : "text-black"
        )}
      >
        {aufträgeText}
      </span>
    </div>
  );
}
