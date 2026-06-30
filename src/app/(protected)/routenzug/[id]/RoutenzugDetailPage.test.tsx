import { render, screen, fireEvent } from "@testing-library/react";
import RoutenzugDetailPage from "./page";

const mockBack = vi.hoisted(() => vi.fn());
const mockPush = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: "RZ-A" })));

vi.mock("next/navigation", () => ({
  useParams: mockUseParams,
  useRouter: () => ({ back: mockBack, push: mockPush }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: "RZ-A" });
});

describe("SC-05 — RoutenzugDetailPage — Happy Path (RZ-A)", () => {
  it("rendert Routenzug-Name im Titel", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
  });

  it("rendert blaue Titelleiste (bg-[#146AA1])", () => {
    const { container } = render(<RoutenzugDetailPage />);
    expect(container.querySelector('[class*="146AA1"]')).toBeInTheDocument();
  });

  it("rendert KameraPanel (km/h Einheit sichtbar)", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("rendert Kamera-Vorne-Bild", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByAltText("Kamera Vorne")).toBeInTheDocument();
  });

  it("rendert FahrtInfoPanel mit StatusBadge", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText(/fährt automatisiert/i)).toBeInTheDocument();
  });

  it("rendert Aufträge aus Mock-Daten", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("AUF-01")).toBeInTheDocument();
    expect(screen.getByText("AUF-02")).toBeInTheDocument();
  });

  it("rendert AktionenPanel mit FahrtmodusCard (initial 'Manuell')", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it("rendert Zurück-Link zur Karte", () => {
    render(<RoutenzugDetailPage />);
    const link = screen.getByRole("link", { name: /zurück/i });
    expect(link).toHaveAttribute("href", "/karte");
  });
});

describe("SC-05 — RoutenzugDetailPage — Zweiter Routenzug (RZ-B)", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "RZ-B" });
  });

  it("rendert 'Routenzug B' im Titel", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Routenzug B")).toBeInTheDocument();
  });

  it("rendert StatusBadge 'lädt'", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText(/lädt/i)).toBeInTheDocument();
  });

  it("rendert Auftrag AUF-03", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("AUF-03")).toBeInTheDocument();
  });
});

describe("SC-05 — RoutenzugDetailPage — Nicht gefunden", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "unbekannt" });
  });

  it('zeigt "Routenzug nicht gefunden" für unbekannte ID', () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText(/routenzug nicht gefunden/i)).toBeInTheDocument();
  });

  it("zeigt Zurück-Link zur Karte im Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/karte");
  });

  it("zeigt keinen Routenzug-Namen im Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText("Routenzug A")).not.toBeInTheDocument();
    expect(screen.queryByText("Routenzug B")).not.toBeInTheDocument();
  });

  it("zeigt keine FahrtmodusCard im Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("SC-05 — RoutenzugDetailPage — FahrtmodusCard Interaktion", () => {
  it("Klick auf 'Auf Automatik umschalten' wechselt Modus zu 'Automatisch'", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(screen.getByText("Automatisch")).toBeInTheDocument();
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("RZ-02 — RoutenzugDetailPage — Abschließen-Bestätigung", () => {
  it("Bestätigungs-Banner ist initial NICHT sichtbar", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText("Fahrt wirklich abschließen?")).not.toBeInTheDocument();
  });

  it("Klick auf 'Abschließen' zeigt Bestätigungs-Banner", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    expect(screen.getByText("Fahrt wirklich abschließen?")).toBeInTheDocument();
  });

  it("Klick auf 'Abschließen' ruft router.back() NICHT auf", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("Nach erstem Klick erscheint 'Ja, abschließen'-Button", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    expect(screen.getByRole("button", { name: "Ja, abschließen" })).toBeInTheDocument();
  });

  it("Nach erstem Klick erscheint 'Abbrechen'-Button", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument();
  });

  it("'Ja, abschließen' ruft router.push('/karte') auf", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Ja, abschließen" }));
    expect(mockPush).toHaveBeenCalledWith("/karte");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("'Abbrechen' schließt das Banner (kein router.push)", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByText("Fahrt wirklich abschließen?")).not.toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("'Abbrechen' stellt den Ausgangszustand wieder her (kein router.back)", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("nach 'Abbrechen' ist der Abschließen-Button noch vorhanden", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(screen.getByRole("button", { name: "Abschließen" })).toBeInTheDocument();
  });

  it("Banner zeigt keine FahrtmodusCard-Fehlmeldung", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Abschließen" }));
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });
});

describe("SC-05 — RoutenzugDetailPage — AktionenPanel Tab-Wechsel", () => {
  it('Tab "Fahrzeug" zeigt Nothalt-Button', () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    expect(screen.getByRole("button", { name: /nothalt/i })).toBeInTheDocument();
  });

  it('Tab "Kommunikation" versteckt FahrtmodusCard', () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("SC-05 — RoutenzugDetailPage — RZ-C (leere Auftragliste)", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "RZ-C" });
  });

  it("rendert 'Routenzug C' im Titel", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Routenzug C")).toBeInTheDocument();
  });

  it("zeigt keinen 'nicht gefunden'-Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText(/routenzug nicht gefunden/i)).not.toBeInTheDocument();
  });

  it("zeigt keine Auftrags-Items (RZ-C hat keine Aufträge)", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText("AUF-01")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-03")).not.toBeInTheDocument();
  });
});
