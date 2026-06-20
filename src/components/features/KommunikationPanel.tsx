"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type KommState = "idle" | "eingehend" | "aktiv";

interface KommunikationPanelProps {
  onStateChange?: (state: KommState) => void;
}

function PhoneCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4c.5-1 2-2 4-1l2 3-2 2a10 10 0 004 4l2-2 3 2c1 2 0 3.5-1 4C6 19 1 6 4 4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneXIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4c.5-1 2-2 4-1l2 3-2 2a10 10 0 004 4l2-2 3 2c1 2 0 3.5-1 4C6 19 1 6 4 4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 3l4 4M17 3l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AktionsButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[173px] h-[77px] bg-[#E1E1E1] rounded-[10px] text-left px-3 py-2 text-[13px] font-semibold text-black hover:bg-[#D5D5D5] transition-colors"
    >
      {label}
    </button>
  );
}

export function KommunikationPanel({ onStateChange }: KommunikationPanelProps) {
  const [state, setState] = useState<KommState>("idle");

  function transition(next: KommState) {
    setState(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex gap-4 h-full min-h-[160px]">
      <div className="flex flex-col gap-2 shrink-0">
        <AktionsButton label="Durchsage tätigen" onClick={() => transition("eingehend")} />
        <AktionsButton label="Fahrgastkommunikation starten" onClick={() => transition("eingehend")} />
      </div>

      <div className={cn("w-px self-stretch", state === "idle" ? "bg-black/10" : "bg-[#2A2F3B]/20")} />

      {state === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-[20px] font-light text-gray-muted">Fahrgastkommunikation</p>
          <p className="text-[20px] text-gray-muted">Keine aktuellen Anfragen</p>
        </div>
      )}

      {state === "eingehend" && (
        <div className="flex-1 flex gap-4 items-center">
          <div className="w-[112px] h-[168px] bg-gray-300 rounded-[10px] shrink-0" aria-label="Kamera-Vorschau" />
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-medium">
              eingehender <strong>Videoanruf</strong> ...
            </p>
            <div className="flex gap-3">
              <button
                aria-label="Annehmen"
                onClick={() => transition("aktiv")}
                className="w-[55px] h-[39px] bg-[#51A135] text-white rounded-[6px] flex items-center justify-center hover:bg-[#449D3C] transition-colors"
              >
                <PhoneCheckIcon />
              </button>
              <button
                aria-label="Ablehnen"
                onClick={() => transition("idle")}
                className="w-[55px] h-[39px] bg-[#C55141] text-white rounded-[6px] flex items-center justify-center hover:bg-[#A8392C] transition-colors"
              >
                <PhoneXIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {state === "aktiv" && (
        <div className="flex-1 flex gap-3 items-center">
          <div className="w-[282px] h-[168px] bg-gray-300 rounded-[10px] shrink-0" aria-label="Haupt-Video" />
          <div className="w-[112px] h-[168px] bg-gray-300 rounded-[10px] shrink-0" aria-label="Seiten-Video" />
          <div className="flex flex-col gap-3 justify-center">
            <p className="text-[12px] font-medium">
              <strong>Videoanruf</strong> 2:10min
            </p>
            <button
              aria-label="Auflegen"
              onClick={() => transition("idle")}
              className="px-4 py-2 bg-[#C55141] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#A8392C] transition-colors"
            >
              Auflegen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
