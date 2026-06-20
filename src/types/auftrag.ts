export type AuftragStatus = "aktiv" | "geplant" | "unterbrochen";
export type AuftragTab = "alle" | "offen" | "archiv";

export interface Auftrag {
  id: string;
  linie?: string;
  art: string;
  von: string;
  ab: string;
  ziel: string;
  auftraggeber: string;
  status: AuftragStatus;
  ankunft: string;
}
