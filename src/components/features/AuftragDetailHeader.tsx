import type { AuftragStatus } from "@/types/auftrag";

interface AuftragDetailHeaderProps {
  id: string;
  art: string;
  status: AuftragStatus;
  onBack: () => void;
}

const STATUS_STYLES: Record<AuftragStatus, { bg: string; text: string; label: string }> = {
  aktiv: { bg: "bg-[#51A135]/50", text: "text-[#103C00]", label: "aktiv" },
  geplant: { bg: "bg-[#9A9EA0]/50", text: "text-[#2A2F3B]", label: "geplant" },
  unterbrochen: { bg: "bg-[#FFC609]/50", text: "text-[#5E4306]", label: "unterbrochen" },
};

export function AuftragDetailHeader({ id, art, status, onBack }: AuftragDetailHeaderProps) {
  const style = STATUS_STYLES[status];
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-blue-primary hover:opacity-70 transition-opacity"
          aria-label="Zurück zu Aufträge"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#146AA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-[18px]">
          <span className="text-black">Aufträge</span>
          {" / "}
          <span className="text-blue-primary">{art} #{id}</span>
        </p>
      </div>
      <span
        className={`inline-flex items-center rounded-lg px-2 py-0.5 font-medium text-[15px] leading-none ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
    </div>
  );
}
