import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";

interface AuftragDetailFieldsProps {
  artikel: string;
  start: string;
  ziel: string;
  routenzug: string;
  ankunft: string;
  auftraggeber: string;
  erstellt: string;
  priorität: 1 | 2 | 3 | 4;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[#646A79] text-[13px]">{label}</span>
      <span className="text-black text-[16px]">{children}</span>
    </div>
  );
}

export function AuftragDetailFields({
  artikel, start, ziel, routenzug, ankunft, auftraggeber, erstellt, priorität,
}: AuftragDetailFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
      <Field label="Artikel">{artikel}</Field>
      <Field label="Priorität"><PrioritätBadge prio={priorität} /></Field>
      <Field label="Start">{start}</Field>
      <Field label="Ziel">{ziel}</Field>
      <Field label="Routenzug">{routenzug}</Field>
      <Field label="Ankunft">{ankunft}</Field>
      <Field label="Auftraggeber">{auftraggeber}</Field>
      <Field label="Erstellt">{erstellt}</Field>
    </div>
  );
}
