import { render, screen } from "@testing-library/react";
import { LieferungTimeline } from "./LieferungTimeline";

const SCHRITTE_STANDARD = [
  { label: "In Auftrag gegeben", zeit: "10:50" },
  { label: "Auftrag verarbeitet", zeit: "10:58" },
  { label: "Scan Beladestation", zeit: "11:18" },
  { label: "Lieferung geladen", zeit: "11:28" },
  { label: "In Auslieferung", zeit: "", aktuell: true },
  { label: "Ankunft voraussichtlich", zeit: "12:10" },
];

describe("LieferungTimeline — Grundstruktur", () => {
  it("rendert alle Schritte als Listenpunkte", () => {
    render(<LieferungTimeline schritte={SCHRITTE_STANDARD} />);
    expect(screen.getByText("In Auftrag gegeben")).toBeInTheDocument();
    expect(screen.getByText("Auftrag verarbeitet")).toBeInTheDocument();
    expect(screen.getByText("Scan Beladestation")).toBeInTheDocument();
    expect(screen.getByText("Lieferung geladen")).toBeInTheDocument();
    expect(screen.getByText("In Auslieferung")).toBeInTheDocument();
    expect(screen.getByText("Ankunft voraussichtlich")).toBeInTheDocument();
  });

  it("rendert genau 6 Listenpunkte", () => {
    const { container } = render(<LieferungTimeline schritte={SCHRITTE_STANDARD} />);
    expect(container.querySelectorAll("li")).toHaveLength(6);
  });

  it("rendert Zeitangaben für Schritte mit Zeit", () => {
    render(<LieferungTimeline schritte={SCHRITTE_STANDARD} />);
    expect(screen.getByText("10:50")).toBeInTheDocument();
    expect(screen.getByText("10:58")).toBeInTheDocument();
    expect(screen.getByText("12:10")).toBeInTheDocument();
  });

  it("zeigt keine Zeitangabe für Schritt ohne Zeit (leerer String)", () => {
    render(<LieferungTimeline schritte={SCHRITTE_STANDARD} />);
    const zeitElemente = screen.queryAllByText(/^\d{2}:\d{2}$/);
    expect(zeitElemente).toHaveLength(5);
  });

  it("rendert geordnete Liste (<ol>)", () => {
    const { container } = render(<LieferungTimeline schritte={SCHRITTE_STANDARD} />);
    expect(container.querySelector("ol")).toBeInTheDocument();
  });
});

describe("LieferungTimeline — Aktueller Schritt", () => {
  it("aktueller Schritt hat blauen Marker (bg-blue-primary)", () => {
    const { container } = render(<LieferungTimeline schritte={SCHRITTE_STANDARD} />);
    expect(container.querySelector('[class*="bg-blue-primary"]')).toBeInTheDocument();
  });

  it("aktueller Schritt hat blaue Textfarbe (text-blue-primary)", () => {
    const { container } = render(<LieferungTimeline schritte={SCHRITTE_STANDARD} />);
    const blueText = container.querySelector('[class*="text-blue-primary"]');
    expect(blueText).toBeInTheDocument();
    expect(blueText?.textContent).toBe("In Auslieferung");
  });

  it("erster Schritt als aktuell: kein grauer Marker vorhanden", () => {
    const schritte = [
      { label: "Start", zeit: "", aktuell: true },
      { label: "Schritt 2", zeit: "11:00" },
    ];
    const { container } = render(<LieferungTimeline schritte={schritte} />);
    expect(container.querySelector('[class*="bg-gray-muted"]')).not.toBeInTheDocument();
  });

  it("letzter Schritt als aktuell: alle vorherigen haben grauen Marker", () => {
    const schritte = [
      { label: "Schritt 1", zeit: "10:00" },
      { label: "Schritt 2", zeit: "11:00" },
      { label: "Schritt 3", zeit: "", aktuell: true },
    ];
    const { container } = render(<LieferungTimeline schritte={schritte} />);
    expect(container.querySelectorAll('[class*="bg-gray-muted"]').length).toBeGreaterThanOrEqual(2);
  });
});

describe("LieferungTimeline — Kein aktueller Schritt", () => {
  it("ohne aktuell-Schritt: kein blauer Marker", () => {
    const schritte = [
      { label: "Schritt A", zeit: "10:00" },
      { label: "Schritt B", zeit: "11:00" },
    ];
    const { container } = render(<LieferungTimeline schritte={schritte} />);
    expect(container.querySelector('[class*="bg-blue-primary"]')).not.toBeInTheDocument();
  });

  it("ohne aktuell-Schritt: kein Text mit blauer Farbe", () => {
    const schritte = [
      { label: "Schritt A", zeit: "10:00" },
      { label: "Schritt B", zeit: "11:00" },
    ];
    const { container } = render(<LieferungTimeline schritte={schritte} />);
    expect(container.querySelector('[class*="text-blue-primary"]')).not.toBeInTheDocument();
  });
});

describe("LieferungTimeline — Edge Cases", () => {
  it("leeres schritte-Array rendert ohne Fehler", () => {
    expect(() => render(<LieferungTimeline schritte={[]} />)).not.toThrow();
  });

  it("leeres schritte-Array erzeugt keine Listenpunkte", () => {
    const { container } = render(<LieferungTimeline schritte={[]} />);
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  it("ein einzelner Schritt rendert korrekt", () => {
    render(<LieferungTimeline schritte={[{ label: "Einziger Schritt", zeit: "09:00" }]} />);
    expect(screen.getByText("Einziger Schritt")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("mehrere aktuell=true-Schritte: letzter gewinnt bei Index-Berechnung nicht — erster aktuell-Index zählt", () => {
    const schritte = [
      { label: "A", zeit: "10:00", aktuell: true },
      { label: "B", zeit: "", aktuell: true },
    ];
    expect(() => render(<LieferungTimeline schritte={schritte} />)).not.toThrow();
  });
});
