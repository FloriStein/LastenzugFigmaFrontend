import type { AuftragStatus } from "@/types/auftrag";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";

interface AuftragListRowProps {
  id: string;
  linie?: string;
  art?: string;
  von?: string;
  ab?: string;
  ziel?: string;
  auftraggeber?: string;
  status: AuftragStatus;
  ankunft?: string;
  enthalteneArtikel?: string;
  showArtikelSpalte?: boolean;
  onClick?: () => void;
}

const STATUS_BADGE_MAP: Record<AuftragStatus, "aktiv" | "geplant" | "unterbrochen-gelb"> = {
  aktiv: "aktiv",
  geplant: "geplant",
  unterbrochen: "unterbrochen-gelb",
};

export function AuftragListRow({
  id,
  linie,
  art,
  von,
  ab,
  ziel,
  auftraggeber,
  status,
  ankunft,
  enthalteneArtikel,
  showArtikelSpalte,
  onClick,
}: AuftragListRowProps) {
  return (
    <div
      role="row"
      onClick={onClick}
      className="grid grid-cols-[120px_100px_130px_180px_160px_100px_1fr] items-center h-12 bg-[rgba(158,172,182,0.1)] rounded-[10px] px-3 cursor-pointer hover:bg-[rgba(158,172,182,0.2)] transition-colors"
    >
      <span className="text-[15px] text-black font-medium truncate">{id}</span>
      <span className="text-[15px] text-black truncate">{linie ?? "—"}</span>
      <span className="text-[15px] text-black truncate">{art ?? "—"}</span>
      {showArtikelSpalte ? (
        <span className="text-[15px] text-black truncate">{enthalteneArtikel ?? "—"}</span>
      ) : (
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] text-black">{von ?? "—"}</span>
          <span className="text-[12px] text-gray-muted">{ab ?? "—"}</span>
        </div>
      )}
      <span className="text-[15px] text-black truncate">{ziel ?? "—"}</span>
      <span className="text-[15px] text-black truncate">{auftraggeber ?? "—"}</span>
      <div className="flex items-center justify-between">
        <StatusBadge type={STATUS_BADGE_MAP[status]} />
        <span className="text-[13px] text-gray-muted">{ankunft ?? "—"}</span>
      </div>
    </div>
  );
}
