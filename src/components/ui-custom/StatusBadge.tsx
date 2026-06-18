import { cn } from "@/lib/utils";

type StatusBadgeType =
  | "fahrt-unterbrochen"
  | "autom-fahren-unterbrochen"
  | "fährt-automatisiert"
  | "lädt"
  | "pause"
  | "aktiv"
  | "offen"
  | "frei"
  | "in-bearbeitung"
  | "geplant"
  | "abgeschlossen"
  | "warten"
  | "belegt"
  | "unterbrochen-gelb"
  | "fehlermeldung"
  | "lieferung"
  | "mitarbeitertransport"
  | "auftrag-abgeschlossen";

interface StatusBadgeProps {
  type: StatusBadgeType;
  percent?: number;
}

const config: Record<StatusBadgeType, { bg: string; text: string; label: string }> = {
  "fahrt-unterbrochen":          { bg: "bg-[#C55141]",       text: "text-white",      label: "Fahrt unterbrochen" },
  "autom-fahren-unterbrochen":   { bg: "bg-[#C55141]",       text: "text-white",      label: "automatisiertes Fahren unterbrochen" },
  "fährt-automatisiert":         { bg: "bg-[#51A135]",       text: "text-white",      label: "fährt automatisiert" },
  "lädt":                        { bg: "bg-[#2D5D7B]",       text: "text-white",      label: "lädt" },
  "pause":                       { bg: "bg-[#DDB411]",       text: "text-white",      label: "automatisierte Fahrt pausiert" },
  "aktiv":                       { bg: "bg-[#51A135]/50",    text: "text-[#103C00]",  label: "aktiv" },
  "offen":                       { bg: "bg-[#51A135]/50",    text: "text-[#103C00]",  label: "offen" },
  "frei":                        { bg: "bg-[#51A135]/50",    text: "text-[#103C00]",  label: "frei" },
  "in-bearbeitung":              { bg: "bg-[#9A9EA0]/50",    text: "text-[#2A2F3B]",  label: "in Bearbeitung" },
  "geplant":                     { bg: "bg-[#9A9EA0]/50",    text: "text-[#2A2F3B]",  label: "geplant" },
  "abgeschlossen":               { bg: "bg-[#9A9EA0]/50",    text: "text-[#1F3848]",  label: "abgeschlossen" },
  "warten":                      { bg: "bg-[#9A9EA0]/50",    text: "text-[#2A2F3B]",  label: "warten zur Erinnerung" },
  "belegt":                      { bg: "bg-[#FFC609]/50",    text: "text-[#5E4306]",  label: "belegt" },
  "unterbrochen-gelb":           { bg: "bg-[#FFC609]/50",    text: "text-[#5E4306]",  label: "unterbrochen" },
  "fehlermeldung":               { bg: "bg-[#C55141]/50",    text: "text-white",      label: "Fehlermeldung" },
  "lieferung":                   { bg: "bg-[#146AA1]/50",    text: "text-[#1F3848]",  label: "Lieferung" },
  "mitarbeitertransport":        { bg: "bg-[#146AA1]/50",    text: "text-[#1F3848]",  label: "Mitarbeitertransport" },
  "auftrag-abgeschlossen":       { bg: "bg-[#146AA1]/50",    text: "text-[#1F3848]",  label: "abgeschlossen" },
};

export function StatusBadge({ type, percent }: StatusBadgeProps) {
  const { bg, text, label } = config[type];
  const displayLabel = type === "lädt" && percent !== undefined ? `lädt (${percent}%)` : label;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] px-2 py-0.5",
        "font-medium text-[15px] leading-none",
        bg,
        text
      )}
    >
      {displayLabel}
    </span>
  );
}
