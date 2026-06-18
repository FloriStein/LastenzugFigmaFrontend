# New Component

Scaffoldet eine neue Feature-Komponente nach Projektkonventionen.

**Verwendung:** `/new-component <ComponentName> <feature-ordner>`

Beispiel: `/new-component FahrtmodusCard features/fahrtmodus`

## Was dieser Befehl tut

1. **Datei anlegen** — Erstelle `src/components/<feature-ordner>/<ComponentName>.tsx`

2. **Struktur generieren:**
   ```tsx
   interface <ComponentName>Props {
     // Props aus dem Kontext ableiten
   }

   export function <ComponentName>({ ... }: <ComponentName>Props) {
     return (
       // Implementierung
     )
   }
   ```

3. **Konventionen prüfen:**
   - Props-Interface direkt über der Komponente (nicht in separater types-Datei, solange < 5 geteilte Typen)
   - Kein Default Export (außer bei Next.js Pages/Layouts)
   - shadcn-Komponenten aus `@/components/ui/` importieren, nie direkt editieren
   - Keine Kommentare außer wenn das Warum nicht offensichtlich ist

4. **shadcn-Basis vorschlagen** — Basierend auf dem Komponenten-Namen und dem design-audit.md Mapping die passende shadcn/ui Basis-Komponente wählen

5. **Index-Export prüfen** — Falls ein `index.ts` im Feature-Ordner existiert, Export hinzufügen

## Wann diesen Befehl nutzen
- Für Feature-Komponenten in `components/[feature]/`
- Nicht für shadcn-Basis-Komponenten in `components/ui/` (die werden per `npx shadcn@latest add` installiert)
- Nicht für Next.js Pages (dafür `/new-screen` nutzen)
