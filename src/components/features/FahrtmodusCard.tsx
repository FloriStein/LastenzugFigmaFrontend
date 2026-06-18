type FahrtmodusVariant =
  | "manuell"
  | "autom-eingabe"
  | "autom-nicht-moeglich"
  | "wiederherstellung";

interface FahrtmodusCardProps {
  variant: FahrtmodusVariant;
}

export function FahrtmodusCard({ variant }: FahrtmodusCardProps) {
  // TODO: Fahrtmodus — Figma Component Set #179:2498
  return <div data-variant={variant} />;
}
