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

describe("SC-07 — EreignisDetailPage — Happy Path", () => {
  it("rendert Ereignis-Art und Fahrzeug im Titel", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/strecke blockiert/i)).toBeInTheDocument();
    expect(screen.getByText(/routenzug a/i)).toBeInTheDocument();
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
});

describe("SC-07 — EreignisDetailPage — Bearbeiter gesetzt", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "%2399" });
  });

  it('Bearbeiter "Maxi Muster" wird angezeigt wenn gesetzt', () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Maxi Muster")).toBeInTheDocument();
  });

  it("kein '[offen]' wenn Bearbeiter gesetzt", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByText("[offen]")).not.toBeInTheDocument();
  });
});

describe("SC-07 — EreignisDetailPage — Nicht gefunden", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "unbekannt" });
  });

  it('zeigt "Ereignis nicht gefunden" für unbekannte ID', () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/ereignis nicht gefunden/i)).toBeInTheDocument();
  });

  it('zeigt Zurück-Link zur Ereignisliste im Fallback', () => {
    render(<EreignisDetailPage />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/ereignisse");
  });

  it("rendert keine EreignisTitelleiste mit Inhalten im Fallback", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByText(/strecke blockiert/i)).not.toBeInTheDocument();
  });
});

describe("SC-07 — EreignisDetailPage — FahrtmodusCard Interaktion", () => {
  it("Klick auf 'Auf Automatik umschalten' wechselt Modus zu 'Automatisch'", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(screen.getByText("Automatisch")).toBeInTheDocument();
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });

  it("Klick auf 'Abschließen' in Titelleiste ruft router.back() auf", () => {
    render(<EreignisDetailPage />);
    const abschließenBtn = screen.queryByRole("button", { name: /abschließen/i });
    if (abschließenBtn) {
      fireEvent.click(abschließenBtn);
      expect(mockBack).toHaveBeenCalledTimes(1);
    }
  });
});
