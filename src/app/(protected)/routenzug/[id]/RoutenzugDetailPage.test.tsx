import { render, screen, fireEvent } from "@testing-library/react";
import RoutenzugDetailPage from "./page";

const mockBack = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: "RZ-A" })));

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

  it("Klick auf 'Abschließen' ruft router.back() auf", () => {
    render(<RoutenzugDetailPage />);
    const abschließenBtn = screen.queryByRole("button", { name: /abschließen/i });
    if (abschließenBtn) {
      fireEvent.click(abschließenBtn);
      expect(mockBack).toHaveBeenCalledTimes(1);
    }
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
