import { useReducer } from "react";
import type { FahrtmodusVariant, FahrtmodusAction } from "@/types/fahrtmodus";

function fahrtmodusReducer(state: FahrtmodusVariant, action: FahrtmodusAction): FahrtmodusVariant {
  switch (action.type) {
    case "SET_MODUS":
      return action.payload;
    case "SYSTEM_OVERRIDE":
      if (state === "autom-eingabe") return "autom-nicht-moeglich";
      return state;
    case "RESTORE":
      if (state === "autom-nicht-moeglich") return "wiederherstellung";
      if (state === "wiederherstellung") return "manuell";
      return state;
    default:
      return state;
  }
}

export function useFahrtmodus(initialVariant: FahrtmodusVariant = "manuell") {
  return useReducer(fahrtmodusReducer, initialVariant);
}
