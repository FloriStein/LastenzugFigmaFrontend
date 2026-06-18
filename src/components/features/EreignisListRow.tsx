import { cn } from "@/lib/utils";
import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";
import type { EreignisStatus } from "@/types/ereignis";

interface EreignisListRowProps {
  id: string;
  art: string;
  fahrzeug: string;
  status: EreignisStatus;
  bearbeiter?: string;
  priorität: 1 | 2 | 3 | 4;
  erstelltAt: string;
  onClick?: () => void;
}

export function EreignisListRow({
  id,
  art,
  fahrzeug,
  status,
  bearbeiter,
  priorität,
  erstelltAt,
  onClick,
}: EreignisListRowProps) {
  const isActive = status === "neu" || status === "warten";

  return (
    <div
      onClick={onClick}
      className={cn(
        "grid grid-cols-[153px_300px_227px_228px_225px_226px_1fr] items-center h-[48px]",
        "w-full rounded-[10px] bg-[rgba(158,172,182,0.1)]",
        isActive ? "text-black" : "text-[#646A79]",
        onClick && "cursor-pointer hover:bg-[rgba(158,172,182,0.18)]"
      )}
    >
      <span className="pl-[23px] font-medium text-[15px]">{id}</span>
      <span className="font-medium text-[15px]">{art}</span>
      <span className="font-medium text-[15px]">{fahrzeug}</span>
      <span className="font-medium text-[15px]">{status}</span>
      <span className="font-medium text-[15px]">
        {bearbeiter ?? <span className="text-[#9A9EA0]">[offen]</span>}
      </span>
      <span>
        <PrioritätBadge prio={priorität} />
      </span>
      <span className="font-medium text-[15px]">{erstelltAt}</span>
    </div>
  );
}
