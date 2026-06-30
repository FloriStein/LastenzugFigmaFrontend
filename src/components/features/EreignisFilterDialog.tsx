"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EreignisFilter, EreignisStatus } from "@/types/ereignis";

const STATUS_LABELS: { value: EreignisStatus; label: string }[] = [
  { value: "neu",            label: "Neu" },
  { value: "in-bearbeitung", label: "In Bearbeitung" },
  { value: "warten",         label: "Warten" },
  { value: "abgeschlossen",  label: "Abgeschlossen" },
];

interface EreignisFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilter: EreignisFilter;
  onApply: (filter: EreignisFilter) => void;
}

export function EreignisFilterDialog({
  open,
  onOpenChange,
  initialFilter,
  onApply,
}: EreignisFilterDialogProps) {
  const [draft, setDraft] = useState<EreignisFilter>(initialFilter);

  function toggleStatus(value: EreignisStatus) {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(value)
        ? prev.status.filter((s) => s !== value)
        : [...prev.status, value],
    }));
  }

  function togglePriorität(p: 1 | 2 | 3 | 4) {
    setDraft((prev) => ({
      ...prev,
      priorität: prev.priorität.includes(p)
        ? prev.priorität.filter((x) => x !== p)
        : [...prev.priorität, p],
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
              Priorität
            </p>
            <div className="flex gap-2">
              {([1, 2, 3, 4] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriorität(p)}
                  className={`w-8 h-8 rounded-full border-2 text-[13px] font-bold transition-colors ${
                    draft.priorität.includes(p)
                      ? "border-blue-primary bg-blue-primary text-white"
                      : "border-gray-border text-dark-surface"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Fahrzeug
            </p>
            <input
              type="text"
              value={draft.fahrzeug}
              onChange={(e) => setDraft((prev) => ({ ...prev, fahrzeug: e.target.value }))}
              placeholder="z.B. Routenzug A"
              className="w-full h-9 px-3 border border-gray-border rounded-[8px] text-[14px] text-dark-surface placeholder:text-gray-muted outline-none focus:border-blue-primary transition-colors"
            />
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
