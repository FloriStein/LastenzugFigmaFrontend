import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { AuftragListItemKurz } from "@/components/features/AuftragListItemKurz";
import type { FahrtStatus } from "@/types/routenzug";

interface FahrtInfoPanelProps {
  fahrtStatus: FahrtStatus;
  aufträge: { id: string; typ: string; priorität: 1 | 2 | 3 | 4 }[];
}

export function FahrtInfoPanel({ fahrtStatus, aufträge }: FahrtInfoPanelProps) {
  return (
    <div className="bg-dark-surface rounded-[10px] p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-gray-muted text-[13px] font-medium">Fahrzeugstatus</span>
        <StatusBadge type={fahrtStatus} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-gray-muted text-[13px] font-medium">Aufträge</span>
        {aufträge.length === 0 ? (
          <span className="text-gray-muted text-[13px]">Keine Aufträge</span>
        ) : (
          <div className="flex flex-col gap-2">
            {aufträge.map((a) => (
              <AuftragListItemKurz key={a.id} id={a.id} typ={a.typ} priorität={a.priorität} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
