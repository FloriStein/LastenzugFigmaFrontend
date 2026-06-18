# Figma Check

Holt einen Figma-Frame und erstellt daraus ein strukturiertes Implementierungs-Briefing.

**Verwendung:** `/figma-check <figma-node-id>`

Beispiel: `/figma-check 506:17806`

## Was dieser Befehl tut

1. **Frame laden** — Rufe `mcp__figma__get_figma_data` mit fileKey `6iHSHiZwZ7ouNQ3KVUy6OK` und der übergebenen nodeId auf

2. **Briefing erstellen** — Analysiere den Frame und gib aus:

   **Layout**
   - Hauptstruktur (Sidebar, Header, Content-Bereich)
   - Abstände, Ausrichtung, Grid-Struktur

   **Komponenten**
   - Welche Figma-Komponenten werden verwendet (mit Component-ID)
   - Mapping zu shadcn/ui oder eigenen Wrapper-Komponenten (aus design-audit.md)

   **Design Tokens**
   - Verwendete Farben (mit Hex-Werten)
   - Typografie-Stile
   - Abweichungen vom Standard-Design-System

   **Interaktive Zustände**
   - Welche States/Varianten sind sichtbar
   - Hover, aktiv, deaktiviert

   **Implementierungs-Hinweise**
   - Besonderheiten oder Fallstricke
   - Welche decisions.md-Entscheidungen relevant sind

3. **Bereit zur Implementierung** — Frage ob direkt mit `/new-screen` oder manuell implementiert werden soll

## Hinweis
fileKey ist immer `6iHSHiZwZ7ouNQ3KVUy6OK` (Routenzüge-Projekt).
Node-IDs sind im design-audit.md unter "Screens-Inventar" zu finden.
