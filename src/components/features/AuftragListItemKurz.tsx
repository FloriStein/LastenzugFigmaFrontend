import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";

interface AuftragListItemKurzProps {
  id: string;
  typ: string;
  priorität: 1 | 2 | 3 | 4;
}

export function AuftragListItemKurz({ id, typ, priorität }: AuftragListItemKurzProps) {
  return (
    <div className="flex items-center gap-3 bg-dark-surface rounded-[8px] px-3 py-2">
      <PrioritätBadge prio={priorität} color="blue" />
      <span className="text-white text-[13px] font-medium flex-1">{typ}</span>
      <span className="text-gray-muted text-[12px]">{id}</span>
    </div>
  );
}
