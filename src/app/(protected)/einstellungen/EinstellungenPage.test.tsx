import { render, screen } from "@testing-library/react";
import EinstellungenPage from "./page";

describe("EI-01 — EinstellungenPage — Seitenstruktur", () => {
  it("zeigt Seitentitel 'Einstellungen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Einstellungen" })).toBeInTheDocument();
  });

  it("zeigt Panel-Titel 'Programm'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByRole("heading", { name: "Programm" })).toBeInTheDocument();
  });

  it("zeigt Panel-Titel 'Tastaturkürzel'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByRole("heading", { name: "Tastaturkürzel" })).toBeInTheDocument();
  });

  it("zeigt Panel-Titel 'Sound'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByRole("heading", { name: "Sound" })).toBeInTheDocument();
  });
});

describe("EI-01 — EinstellungenPage — Programm-Panel", () => {
  it("zeigt Sektion 'Hilfen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Hilfen")).toBeInTheDocument();
  });

  it("zeigt Toggle-Label 'Erweiterte Erklärungen für Bedienelemente'", () => {
    render(<EinstellungenPage />);
    expect(
      screen.getByText("Erweiterte Erklärungen für Bedienelemente")
    ).toBeInTheDocument();
  });

  it("zeigt Toggle-Label 'Hinweise zu Tastaturkürzeln'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Hinweise zu Tastaturkürzeln")).toBeInTheDocument();
  });

  it("zeigt Sektion 'Aussehen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Aussehen")).toBeInTheDocument();
  });

  it("zeigt Label 'Theme'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("zeigt Sektion 'Trainingsmodus' als Überschrift", () => {
    render(<EinstellungenPage />);
    expect(screen.getByRole("heading", { name: "Trainingsmodus" })).toBeInTheDocument();
  });

  it("zeigt Button 'Trainingsmodus'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByRole("button", { name: "Trainingsmodus" })).toBeInTheDocument();
  });
});

describe("EI-01 — EinstellungenPage — Tastaturkürzel-Panel", () => {
  it("zeigt Gruppe 'Ereignisbearbeitung'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Ereignisbearbeitung")).toBeInTheDocument();
  });

  it("zeigt Gruppe 'Kamera'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Kamera")).toBeInTheDocument();
  });

  it("zeigt Gruppe 'Informationen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Informationen")).toBeInTheDocument();
  });

  it("zeigt Gruppe 'Aktionen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Aktionen")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'n' mit Beschreibung 'Nächste Ansicht'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("n")).toBeInTheDocument();
    expect(screen.getByText("Nächste Ansicht")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'f' mit Beschreibung 'Filter'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("f")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'r' mit Beschreibung 'Zoom zurücksetzen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("r")).toBeInTheDocument();
    expect(screen.getByText("Zoom zurücksetzen")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'q' mit Beschreibung 'Fahrzeuginformationen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("q")).toBeInTheDocument();
    expect(screen.getByText("Fahrzeuginformationen")).toBeInTheDocument();
  });
});

describe("EI-01 — EinstellungenPage — Sound-Panel", () => {
  it("zeigt Label 'Lautstärke'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Lautstärke")).toBeInTheDocument();
  });

  it("zeigt Label 'Benachrichtigungen'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Benachrichtigungen")).toBeInTheDocument();
  });

  it("zeigt Label 'Fahrgastkommunikation'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Fahrgastkommunikation")).toBeInTheDocument();
  });

  it("zeigt Label 'Fahrzeug' (Slider im Sound-Panel)", () => {
    render(<EinstellungenPage />);
    const matches = screen.getAllByText("Fahrzeug");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("zeigt Initialwert für Lautstärke (48)", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("48")).toBeInTheDocument();
  });

  it("zeigt Initialwert für Benachrichtigungen (40)", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("zeigt Initialwert für Fahrgastkommunikation (60)", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("zeigt Initialwert für Fahrzeug (50)", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("zeigt Label 'Eingabegerät'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Eingabegerät")).toBeInTheDocument();
  });

  it("zeigt Label 'Ausgabegerät'", () => {
    render(<EinstellungenPage />);
    expect(screen.getByText("Ausgabegerät")).toBeInTheDocument();
  });
});
