export type EreignisStatus =
  | "neu"
  | "in-bearbeitung"
  | "warten"
  | "abgeschlossen";

export interface Ereignis {
  id: string;
  art: string;
  fahrzeug: string;
  status: EreignisStatus;
  bearbeiter?: string;
  priorität: 1 | 2 | 3 | 4;
  erstelltAt: string;
}
