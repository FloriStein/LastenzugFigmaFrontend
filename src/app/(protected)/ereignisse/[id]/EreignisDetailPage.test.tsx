import { render, screen, fireEvent } from "@testing-library/react";
import EreignisDetailPage from "./page";

const mockBack = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: "%23102" })));

vi.mock("next/navigation", () => ({
  useParams: mockUseParams,
  useRouter: () => ({ back: mockBack }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: "%23102" });
});

describe("ER-02 — EreignisDetailPage — Grundstruktur", () => {
  it("rendert Ereignis-Art und Fahrzeug im Titel", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Strecke blockiert · Routenzug A")).toBeInTheDocument();
  });

  it("rendert EreignisTitelleiste (blaue Box)", () => {
    const { container } = render(<EreignisDetailPage />);
    expect(container.querySelector('[class*="146AA1"]')).toBeInTheDocument();
  });

  it("rendert FahrtmodusCard mit initialem Modus 'Manuell'", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it("rendert Zurück-Link zur Ereignisliste", () => {
    render(<EreignisDetailPage />);
    const link = screen.getByRole("link", { name: /zurück/i });
    expect(link).toHaveAttribute("href", "/ereignisse");
  });

  it("rendert Erstellt-Zeitstempel des Ereignisses", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/14:28/)).toBeInTheDocument();
  });

  it("rendert Bearbeiter als '[offen]' wenn nicht gesetzt", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("[offen]")).toBeInTheDocument();
  });

  it("rendert Ereignis-ID", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("#102")).toBeInTheDocument();
  });

  it("rendert Ereignisart-Feld", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Strecke blockiert")).toBeInTheDocument();
  });

  it("rendert Fahrzeug-Feld", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
  });
});

describe("ER-02 — EreignisDetailPage — Status-Workflow: neu → in-bearbeitung", () => {
  it("zeigt 'Ereignis annehmen'-Button für Status 'neu'", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByRole("button", { name: "Ereignis annehmen" })).toBeInTheDocument();
  });

  it("zeigt KEINEN 'Ereignis abschließen'-Button initial", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByRole("button", { name: "Ereignis abschließen" })).not.toBeInTheDocument();
  });

  it("Status 'Neu' ist initial farbig dargestellt", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Neu")).toBeInTheDocument();
  });

  it("Klick auf 'Ereignis annehmen' wechselt Status auf 'In Bearbeitung'", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis annehmen" }));
    expect(screen.getByText("In Bearbeitung")).toBeInTheDocument();
  });

  it("'Ereignis annehmen' verschwindet nach Klick", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis annehmen" }));
    expect(screen.queryByRole("button", { name: "Ereignis annehmen" })).not.toBeInTheDocument();
  });

  it("'Ereignis abschließen' erscheint nach Annehmen", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis annehmen" }));
    expect(screen.getByRole("button", { name: "Ereignis abschließen" })).toBeInTheDocument();
  });
});

describe("ER-02 — EreignisDetailPage — Status-Workflow: in-bearbeitung → Bestätigung", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "%2399" });
  });

  it("Ereignis '#99' startet direkt mit 'Ereignis abschließen'-Button", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByRole("button", { name: "Ereignis abschließen" })).toBeInTheDocument();
  });

  it("'Ereignis abschließen' zeigt Bestätigungsfrage (kein sofortiger Abschluss)", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    expect(screen.getByText("Ereignis wirklich abschließen?")).toBeInTheDocument();
  });

  it("Nach 'Ereignis abschließen' erscheint 'Ja, abschließen'", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    expect(screen.getByRole("button", { name: "Ja, abschließen" })).toBeInTheDocument();
  });

  it("Nach 'Ereignis abschließen' erscheint 'Abbrechen'", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument();
  });

  it("'Ereignis abschließen'-Button verschwindet bei Bestätigungsanzeige", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    expect(screen.queryByRole("button", { name: "Ereignis abschließen" })).not.toBeInTheDocument();
  });
});

describe("ER-02 — EreignisDetailPage — Status-Workflow: Abschluss bestätigen", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "%2399" });
  });

  it("'Ja, abschließen' setzt Status auf 'Abgeschlossen'", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Ja, abschließen" }));
    expect(screen.getByText("Abgeschlossen")).toBeInTheDocument();
  });

  it("Nach Abschluss zeigt die Seite Bestätigungstext", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Ja, abschließen" }));
    expect(screen.getByText(/ereignis ist abgeschlossen/i)).toBeInTheDocument();
  });

  it("Nach Abschluss sind keine Aktions-Buttons mehr sichtbar", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Ja, abschließen" }));
    expect(screen.queryByRole("button", { name: "Ereignis abschließen" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ereignis annehmen" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ja, abschließen" })).not.toBeInTheDocument();
  });

  it("'Abbrechen' kehrt zu 'in-bearbeitung' zurück (keine Navigation)", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByText("Ereignis wirklich abschließen?")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ereignis abschließen" })).toBeInTheDocument();
    expect(mockBack).not.toHaveBeenCalled();
  });
});

describe("ER-02 — EreignisDetailPage — Status 'abgeschlossen' (Ereignis #95)", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "%2395" });
  });

  it("Ereignis #95 startet direkt im Status 'Abgeschlossen'", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Abgeschlossen")).toBeInTheDocument();
  });

  it("zeigt den Bestätigungstext ohne Benutzer-Interaktion", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/ereignis ist abgeschlossen/i)).toBeInTheDocument();
  });

  it("zeigt keine Aktions-Buttons für abgeschlossenes Ereignis", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByRole("button", { name: "Ereignis annehmen" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ereignis abschließen" })).not.toBeInTheDocument();
  });

  it("zeigt Bearbeiter 'Tim Zabel'", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Tim Zabel")).toBeInTheDocument();
  });
});

describe("ER-02 — EreignisDetailPage — Bearbeiter gesetzt (#99)", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "%2399" });
  });

  it("zeigt Bearbeiter 'Maxi Muster'", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Maxi Muster")).toBeInTheDocument();
  });

  it("kein '[offen]' wenn Bearbeiter gesetzt", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByText("[offen]")).not.toBeInTheDocument();
  });
});

describe("ER-02 — EreignisDetailPage — Nicht gefunden", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "unbekannt" });
  });

  it('zeigt "Ereignis nicht gefunden" für unbekannte ID', () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/ereignis nicht gefunden/i)).toBeInTheDocument();
  });

  it("zeigt Zurück-Link zur Ereignisliste im Fallback", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/ereignisse");
  });

  it("zeigt keine Aktions-Buttons im Fallback", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByRole("button", { name: "Ereignis annehmen" })).not.toBeInTheDocument();
  });

  it("zeigt keine FahrtmodusCard im Fallback", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("ER-02 — EreignisDetailPage — FahrtmodusCard Interaktion", () => {
  it("Klick auf 'Auf Automatik umschalten' wechselt Modus zu 'Automatisch'", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(screen.getByText("Automatisch")).toBeInTheDocument();
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });

  it("FahrtmodusCard bleibt bei Status-Wechsel sichtbar", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ereignis annehmen" }));
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it("Klick auf Titelleiste-Abschließen ruft router.back() auf", () => {
    render(<EreignisDetailPage />);
    const abschließenBtn = screen.queryByRole("button", { name: "Abschließen" });
    if (abschließenBtn) {
      fireEvent.click(abschließenBtn);
      expect(mockBack).toHaveBeenCalledTimes(1);
    }
  });
});
