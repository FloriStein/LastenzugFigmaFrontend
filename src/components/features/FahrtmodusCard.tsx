import { cn } from "@/lib/utils";
import type { FahrtmodusVariant } from "@/types/fahrtmodus";

interface FahrtmodusCardProps {
  variant: FahrtmodusVariant;
  onPrimaryAction?: () => void;
}

const MODUS_CONFIG: Record<FahrtmodusVariant, {
  label: string;
  subtext: string;
  buttonText: string;
  badgeBg: string;
}> = {
  "manuell":              { label: "Manuell",            subtext: "Fahrtmodus: Manuell",                buttonText: "Auf Automatik umschalten", badgeBg: "bg-[#353535]" },
  "autom-eingabe":        { label: "Automatisch",         subtext: "Eingabe erforderlich",               buttonText: "Bestätigen",               badgeBg: "bg-[#146AA1]" },
  "autom-nicht-moeglich": { label: "Autom. nicht mögl.", subtext: "Automatisches Fahren nicht möglich", buttonText: "Manuell fahren",           badgeBg: "bg-[#C55141]" },
  "wiederherstellung":    { label: "Wiederherstellung",  subtext: "Wiederherstellung möglich",          buttonText: "Wiederherstellen",          badgeBg: "bg-[#DDB411]" },
};

export function FahrtmodusCard({ variant, onPrimaryAction }: FahrtmodusCardProps) {
  const config = MODUS_CONFIG[variant];
  return (
    <div className="w-120 bg-dark-surface rounded-[10px] p-6 flex flex-col min-h-55">
      <span
        className={cn(
          "inline-flex items-center self-start px-3 py-1 rounded-[6px] text-white text-[13px] font-medium",
          config.badgeBg
        )}
      >
        {config.label}
      </span>
      <p className="text-gray-muted text-[15px] mt-2">{config.subtext}</p>
      {variant === "autom-eingabe" && (
        <input
          type="text"
          placeholder="Bestätigungscode eingeben"
          className="mt-4 rounded-[6px] border border-[#4A4F5B] bg-[#1E2229] text-white px-3 py-2 text-[14px] placeholder:text-gray-muted"
        />
      )}
      <button
        onClick={onPrimaryAction}
        className="w-full mt-auto bg-blue-primary text-white rounded-[6px] px-6 py-3 text-[15px] font-medium"
      >
        {config.buttonText}
      </button>
    </div>
  );
}
