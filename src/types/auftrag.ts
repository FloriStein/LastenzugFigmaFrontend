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

export type AuftragFilter = {
  status: AuftragStatus[];
  art: string[];
};

export const EMPTY_AUFTRAG_FILTER: AuftragFilter = {
  status: [],
  art: [],
};
