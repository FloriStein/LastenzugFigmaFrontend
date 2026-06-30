"use client";

import { useState } from "react";

interface AuftragAktionsleistenProps {
  onBearbeiten: () => void;
  onStornieren: () => void;
}

export function AuftragAktionsleiste({ onBearbeiten, onStornieren }: AuftragAktionsleistenProps) {
  const [bestätigen, setBestätigen] = useState(false);

  return (
    <div
      className="flex items-center gap-4 rounded-[10px] px-6 py-4"
      style={{ background: "rgba(158, 172, 182, 0.1)" }}
    >
      <button
        onClick={onBearbeiten}
        className="bg-blue-primary text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-blue-primary/80 transition-colors"
      >
        Auftrag bearbeiten
      </button>

      {!bestätigen ? (
        <button
          onClick={() => setBestätigen(true)}
          className="bg-red-600 text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-red-600/80 transition-colors"
        >
          Auftrag stornieren
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-[14px] text-[#646A79]">Auftrag wirklich stornieren?</span>
          <button
            onClick={() => { onStornieren(); setBestätigen(false); }}
            className="bg-red-600 text-white rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-red-600/80 transition-colors"
          >
            Ja, stornieren
          </button>
          <button
            onClick={() => setBestätigen(false)}
            className="border border-gray-300 text-dark-surface rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      )}
    </div>
  );
}
