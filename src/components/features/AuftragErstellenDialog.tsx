"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Auftrag } from "@/types/auftrag";

type AuftragFormData = Omit<Auftrag, "id">;

const ART_OPTIONS = ["Lieferauftrag", "Mitarbeitertransport", "Leerfahrt"] as const;

interface AuftragErstellenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AuftragFormData) => void;
}

const EMPTY_FORM: AuftragFormData = {
  art: "Lieferauftrag",
  von: "",
  ab: "",
  ziel: "",
  auftraggeber: "",
  status: "geplant",
  ankunft: "",
};

export function AuftragErstellenDialog({
  open,
  onOpenChange,
  onSubmit,
}: AuftragErstellenDialogProps) {
  const [form, setForm] = useState<AuftragFormData>(EMPTY_FORM);

  function set(field: keyof AuftragFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.von || !form.ziel || !form.auftraggeber) return;
    onSubmit(form);
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-white rounded-[10px] p-6 w-[480px] shadow-lg"
      >
        <DialogTitle className="text-[18px] font-bold text-dark-surface mb-5">
          Neuen Auftrag erstellen
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="auftrag-art" className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide block mb-1.5">
              Art
            </label>
            <select
              id="auftrag-art"
              value={form.art}
              onChange={(e) => set("art", e.target.value)}
              className="w-full h-9 px-3 border border-gray-border rounded-[8px] text-[14px] text-dark-surface outline-none focus:border-blue-primary bg-white"
            >
              {ART_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {(["von", "ziel", "auftraggeber", "ab"] as const).map((field) => {
            const labelText = field === "von" ? "Von" : field === "ziel" ? "Ziel" : field === "auftraggeber" ? "Auftraggeber" : "Abfahrt (Uhrzeit)";
            return (
              <div key={field}>
                <label htmlFor={`auftrag-${field}`} className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide block mb-1.5">
                  {labelText}
                </label>
                <input
                  id={`auftrag-${field}`}
                  type="text"
                  value={form[field] as string}
                  onChange={(e) => set(field, e.target.value)}
                  placeholder={field === "ab" ? "08:30" : ""}
                  className="w-full h-9 px-3 border border-gray-border rounded-[8px] text-[14px] text-dark-surface placeholder:text-gray-muted outline-none focus:border-blue-primary transition-colors"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={() => { setForm(EMPTY_FORM); onOpenChange(false); }}
            className="px-4 py-2 rounded-[8px] border border-gray-border text-dark-surface text-[14px] font-medium hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.von || !form.ziel || !form.auftraggeber}
            className="px-4 py-2 rounded-[8px] bg-blue-primary text-white text-[14px] font-medium hover:bg-blue-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Erstellen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
