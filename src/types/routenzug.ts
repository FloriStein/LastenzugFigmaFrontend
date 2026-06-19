export type FahrtStatus = "fahrt-unterbrochen" | "fährt-automatisiert" | "lädt";

export interface Routenzug {
  id: string;
  name: string;
  aufträge: string[];
  status: FahrtStatus;
  ladestand?: number;
  position: { x: number; y: number };
}
