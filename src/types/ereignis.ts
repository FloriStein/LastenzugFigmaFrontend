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
  betroffen?: string;
}

export type EreignisFilter = {
  status: EreignisStatus[];
  priorität: (1 | 2 | 3 | 4)[];
  fahrzeug: string;
};

export const EMPTY_EREIGNIS_FILTER: EreignisFilter = {
  status: [],
  priorität: [],
  fahrzeug: "",
};
