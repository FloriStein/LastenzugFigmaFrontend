# New Screen

Scaffoldet einen neuen Screen vollständig nach Projektkonventionen.

**Verwendung:** `/new-screen <screen-name> <rolle> <figma-node-id>`

Beispiel: `/new-screen auftraege operator 506:17806`

## Was dieser Befehl tut

1. **Figma-Frame holen** — Rufe `mcp__figma__get_figma_data` mit fileKey `6iHSHiZwZ7ouNQ3KVUy6OK` und der übergebenen nodeId auf. Analysiere Layout, Komponenten und Struktur.

2. **Route anlegen** — Erstelle die Datei `src/app/(<rolle>)/<screen-name>/page.tsx` mit:
   - Default Export (Next.js Page-Konvention)
   - Seitentitel als `<h1>` aus dem Figma-Frame
   - Platzhalter-Struktur basierend auf dem Figma-Layout
   - TypeScript, keine `any`-Typen

3. **Komponenten-Slots identifizieren** — Liste auf welche Feature-Komponenten dieser Screen braucht (noch nicht erstellen, nur benennen)

4. **decisions.md prüfen** — Stelle sicher dass keine offene Entscheidung die Implementierung blockiert

5. **Ergebnis melden** — Zeige den erstellten Dateipfad und die identifizierten Komponenten-Slots

## Konventionen
- Dateiname der Page: immer `page.tsx`
- Keine Logik in der Page — nur Layout und Komponentenkomposition
- Rollen-Mapping: `operator` → `(operator)`, `schichtleitung` → `(schichtleitung)`, `mitarbeiter` → `(mitarbeiter)`, `gast` → `(gast)`
