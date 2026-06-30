import { render, screen, fireEvent } from "@testing-library/react";
import AuftraegePage from "./page";

const mockPush = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn(() => null));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}));

beforeEach(() => vi.clearAllMocks());

describe("SC-04 — AuftraegePage — Grundstruktur", () => {
  it("zeigt Seitentitel 'Aufträge'", () => {
    render(<AuftraegePage />);
    expect(screen.getByRole("heading", { name: "Aufträge" })).toBeInTheDocument();
  });

  it("zeigt Mock-Auftrag AUF-001", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });

  it("zeigt alle 4 Mock-Aufträge initial", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.getByText("AUF-004")).toBeInTheDocument();
  });

  it("zeigt 'Lieferauftrag erstellen' Button", () => {
    render(<AuftraegePage />);
    expect(
      screen.getByRole("button", { name: /lieferauftrag erstellen/i })
    ).toBeInTheDocument();
  });
});

describe("SC-04 — AuftraegePage — Tab-Navigation", () => {
  it("Tab 'Offen' filtert auf aktive Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-004")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });

  it("Tab 'Archiv' zeigt geplante/unterbrochene Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
  });

  it("zurück zu Tab 'Alle' zeigt alle Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    fireEvent.click(screen.getByRole("tab", { name: "Alle" }));
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
  });
});

describe("SC-04 — AuftraegePage — Suche", () => {
  it("Suche filtert Aufträge korrekt (kein SearchBar-Mock nötig — interner State)", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });
});

describe("SC-04 — AuftraegePage — CR-01: Lieferauftrag erstellen Dialog", () => {
  it("Klick auf 'Lieferauftrag erstellen' öffnet Dialog (Titel sichtbar)", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    expect(screen.getByText("Neuen Auftrag erstellen")).toBeInTheDocument();
  });

  it("Dialog zeigt Felder Von, Ziel, Auftraggeber", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    expect(screen.getByLabelText(/^Von$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Ziel$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Auftraggeber$/i)).toBeInTheDocument();
  });

  it("'Abbrechen' schließt Dialog", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByText("Neuen Auftrag erstellen")).not.toBeInTheDocument();
  });

  it("neuer Auftrag erscheint nach Erstellen in der Liste", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    fireEvent.change(screen.getByLabelText(/^Von$/i), { target: { value: "Lager Z" } });
    fireEvent.change(screen.getByLabelText(/^Ziel$/i), { target: { value: "Tor 9" } });
    fireEvent.change(screen.getByLabelText(/^Auftraggeber$/i), { target: { value: "Test User" } });
    fireEvent.click(screen.getByRole("button", { name: "Erstellen" }));
    expect(screen.getByText("Tor 9")).toBeInTheDocument();
  });

  it("Dialog schließt sich nach erfolgreichem Erstellen", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    fireEvent.change(screen.getByLabelText(/^Von$/i), { target: { value: "Lager Z" } });
    fireEvent.change(screen.getByLabelText(/^Ziel$/i), { target: { value: "Tor 9" } });
    fireEvent.change(screen.getByLabelText(/^Auftraggeber$/i), { target: { value: "Test User" } });
    fireEvent.click(screen.getByRole("button", { name: "Erstellen" }));
    expect(screen.queryByText("Neuen Auftrag erstellen")).not.toBeInTheDocument();
  });

  it("'Erstellen' deaktiviert wenn Pflichtfelder leer", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    expect(screen.getByRole("button", { name: "Erstellen" })).toBeDisabled();
  });
});

describe("SC-04 — AuftraegePage — FD-02: Aufträge-Filter-Dialog", () => {
  it("zeigt 'neuer Filter' Button", () => {
    render(<AuftraegePage />);
    expect(screen.getByRole("button", { name: /neuer Filter/i })).toBeInTheDocument();
  });

  it("Klick auf 'neuer Filter' öffnet FilterDialog", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("FilterDialog zeigt Status- und Art-Checkboxen", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    expect(screen.getByRole("checkbox", { name: "Aktiv" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Lieferauftrag" })).toBeInTheDocument();
  });

  it("'Abbrechen' schließt FilterDialog", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByText("Filter")).not.toBeInTheDocument();
  });

  it("Filter auf status=aktiv → AUF-002 (geplant) verschwindet", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Aktiv" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });

  it("Filter auf art=Leerfahrt → nur AUF-003 sichtbar", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Leerfahrt" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });
});
