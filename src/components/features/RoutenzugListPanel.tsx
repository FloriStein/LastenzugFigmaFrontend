import type { Routenzug } from "@/types/routenzug";
import { RoutenzugCard } from "@/components/features/RoutenzugCard";

interface RoutenzugListPanelProps {
  routenzüge: Routenzug[];
  onSelect: (id: string) => void;
  onClose?: () => void;
}

export function RoutenzugListPanel({ routenzüge, onSelect, onClose }: RoutenzugListPanelProps) {
  return (
    <div className="w-[505px] h-screen flex-shrink-0 bg-[#353B4A] relative overflow-hidden">
      <h2 className="absolute left-[34px] top-[55px] text-white font-bold text-[32px] leading-none">
        Routenzüge
      </h2>

      <button
        onClick={onClose}
        className="absolute right-[35px] top-[27px] w-[28px] h-[28px] flex items-center justify-center text-[rgba(255,255,255,0.62)] hover:text-white transition-colors"
        aria-label="Panel schließen"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {routenzüge.map((rz, index) => (
        <div
          key={rz.id}
          className="absolute left-[34px]"
          style={{ top: `${140 + index * 131}px` }}
        >
          <RoutenzugCard
            name={rz.name}
            aufträge={rz.aufträge}
            status={rz.status}
            ladestand={rz.ladestand}
            onClick={() => onSelect(rz.id)}
          />
        </div>
      ))}
    </div>
  );
}
