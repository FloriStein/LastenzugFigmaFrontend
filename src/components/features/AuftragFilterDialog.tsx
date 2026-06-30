"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AuftragFilter, AuftragStatus } from "@/types/auftrag";

const STATUS_LABELS: { value: AuftragStatus; label: string }[] = [
  { value: "aktiv",        label: "Aktiv" },
  { value: "geplant",      label: "Geplant" },
  { value: "unterbrochen", label: "Unterbrochen" },
];

const ART_OPTIONS = ["Lieferauftrag", "Mitarbeitertransport", "Leerfahrt"] as const;

interface AuftragFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilter: AuftragFilter;
  onApply: (filter: AuftragFilter) => void;
}

export function AuftragFilterDialog({
  open,
  onOpenChange,
  initialFilter,
  onApply,
}: AuftragFilterDialogProps) {
  const [draft, setDraft] = useState<AuftragFilter>(initialFilter);

  function toggleStatus(value: AuftragStatus) {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(value)
        ? prev.status.filter((s) => s !== value)
        : [...prev.status, value],
    }));
  }

  function toggleArt(value: string) {
    setDraft((prev) => ({
      ...prev,
      art: prev.art.includes(value)
        ? prev.art.filter((a) => a !== value)
        : [...prev.art, value],
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-white rounded-[10px] p-6 w-[440px] shadow-lg"
      >
        <DialogTitle className="text-[18px] font-bold text-dark-surface mb-5">
          Filter
        </DialogTitle>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Status
            </p>
            <div className="flex flex-col gap-2">
              {STATUS_LABELS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.status.includes(value)}
                    onChange={() => toggleStatus(value)}
                    className="w-4 h-4 accent-blue-primary"
                  />
                  <span className="text-[14px] text-dark-surface">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Auftragsart
            </p>
            <div className="flex flex-col gap-2">
              {ART_OPTIONS.map((art) => (
                <label key={art} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.art.includes(art)}
                    onChange={() => toggleArt(art)}
                    className="w-4 h-4 accent-blue-primary"
                  />
                  <span className="text-[14px] text-dark-surface">{art}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={() => { setDraft(initialFilter); onOpenChange(false); }}
            className="px-4 py-2 rounded-[8px] border border-gray-border text-dark-surface text-[14px] font-medium hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => { onApply(draft); onOpenChange(false); }}
            className="px-4 py-2 rounded-[8px] bg-blue-primary text-white text-[14px] font-medium hover:bg-blue-primary/80 transition-colors"
          >
            Anwenden
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
