export type FahrtmodusVariant =
  | "manuell"
  | "autom-eingabe"
  | "autom-nicht-moeglich"
  | "wiederherstellung";

export type FahrtmodusAction =
  | { type: "SET_MODUS"; payload: FahrtmodusVariant }
  | { type: "SYSTEM_OVERRIDE" }
  | { type: "RESTORE" };
