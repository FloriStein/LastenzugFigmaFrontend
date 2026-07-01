import { render, screen, fireEvent } from "@testing-library/react";
import AuftragDetailPage from "./page";

const mockPush = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn().mockReturnValue({ id: "nonexistent" }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => mockUseParams(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: "nonexistent" });
});

describe("AT-01 — AuftragDetailPage — Breadcrumb & Header", () => {
  it("zeigt 'Aufträge' im Breadcrumb", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Aufträge")).toBeInTheDocument();
  });

  it("zeigt 'Lieferung #212' im Breadcrumb", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Lieferung #212")).toBeInTheDocument();
  });

  it("zeigt Status-Badge 'aktiv'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("aktiv")).toBeInTheDocument();
  });

  it("Zurück-Button navigiert zu /auftraege", () => {
    render(<AuftragDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Zurück zu Aufträge" }));
    expect(mockPush).toHaveBeenCalledWith("/auftraege");
  });
});

describe("AT-01 — AuftragDetailPage — Auftragsfelder", () => {
  it("zeigt Artikel-Wert", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Karosserieteil #12312 (4 Stk.)")).toBeInTheDocument();
  });

  it("zeigt Start 'Lager B'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Lager B")).toBeInTheDocument();
  });

  it("zeigt Ziel 'Lager A'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Lager A")).toBeInTheDocument();
  });

  it("zeigt Routenzug 'Routenzug A'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
  });

  it("zeigt Ankunftszeit", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("12:10 Uhr (in 12min)")).toBeInTheDocument();
  });

  it("zeigt Auftraggeber 'Alex Auftrag'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Alex Auftrag")).toBeInTheDocument();
  });

  it("zeigt Erstellt-Zeit '10:50 Uhr'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("10:50 Uhr")).toBeInTheDocument();
  });
});

describe("AT-01 — AuftragDetailPage — Aktionsleiste", () => {
  it("zeigt Button 'Auftrag bearbeiten'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByRole("button", { name: "Auftrag bearbeiten" })).toBeInTheDocument();
  });

  it("zeigt Button 'Auftrag stornieren'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByRole("button", { name: "Auftrag stornieren" })).toBeInTheDocument();
  });

  it("zeigt 'In Karte anzeigen' Link", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("In Karte anzeigen")).toBeInTheDocument();
  });
});

describe("AT-01 — AuftragDetailPage — Timeline", () => {
  it("zeigt Abschnittsüberschrift 'Lieferungsverlauf'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByRole("heading", { name: "Lieferungsverlauf" })).toBeInTheDocument();
  });

  it("zeigt alle 6 Timeline-Schritte", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("In Auftrag gegeben")).toBeInTheDocument();
    expect(screen.getByText("Auftrag verarbeitet")).toBeInTheDocument();
    expect(screen.getByText("Scan Beladestation")).toBeInTheDocument();
    expect(screen.getByText("Lieferung geladen")).toBeInTheDocument();
    expect(screen.getByText("In Auslieferung")).toBeInTheDocument();
    expect(screen.getByText("Ankunft voraussichtlich")).toBeInTheDocument();
  });

  it("zeigt Timeline-Zeitangaben", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("10:50")).toBeInTheDocument();
    expect(screen.getByText("10:58")).toBeInTheDocument();
  });
});

describe("AT-01 — AuftragDetailPage — Fallback-Logik", () => {
  it("id='212' → zeigt Lieferungs-Ansicht", () => {
    mockUseParams.mockReturnValue({ id: "212" });
    render(<AuftragDetailPage />);
    expect(screen.getByText("Lieferung #212")).toBeInTheDocument();
    expect(screen.getByText("Lieferungsverlauf")).toBeInTheDocument();
  });

  it("unbekannte id → Fallback auf Lieferung #212", () => {
    mockUseParams.mockReturnValue({ id: "UNKNOWN_ID" });
    render(<AuftragDetailPage />);
    expect(screen.getByText("Lieferung #212")).toBeInTheDocument();
  });

  it("URL-encodierte id wird korrekt dekodiert (%23212 → #212 → Fallback)", () => {
    mockUseParams.mockReturnValue({ id: "%23212" });
    render(<AuftragDetailPage />);
    expect(screen.getByText("Lieferung #212")).toBeInTheDocument();
  });
});

describe("AU-02 — AuftragDetailPage — Mitarbeitertransport-Ansicht", () => {
  beforeEach(() => mockUseParams.mockReturnValue({ id: "MT-A" }));

  it("zeigt 'Aufträge' in der Kopfzeile", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Aufträge")).toBeInTheDocument();
  });

  it("zeigt 'Mitarbeitertransport #Linie A' in der Kopfzeile", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText(/Mitarbeitertransport #Linie A/)).toBeInTheDocument();
  });

  it("zeigt Badge 'Mitarbeitertransport'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getAllByText("Mitarbeitertransport").length).toBeGreaterThan(0);
  });

  it("zeigt Badge 'aktiv'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("aktiv")).toBeInTheDocument();
  });

  it("zeigt Feld 'Start' mit Wert 'Lager C'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getAllByText("Lager C").length).toBeGreaterThan(0);
  });

  it("zeigt Feld 'Endhaltestelle' mit Wert 'Hauptgebäude'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getAllByText("Hauptgebäude").length).toBeGreaterThan(0);
  });

  it("zeigt Routenzug 'Routenzug A'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
  });

  it("zeigt Fahrgäste-Feld", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText(/4.*aktuell/)).toBeInTheDocument();
  });

  it("zeigt Abschnitt 'Linienverlauf'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Linienverlauf")).toBeInTheDocument();
  });

  it("zeigt Haltestellen im Linienverlauf", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Lager E")).toBeInTheDocument();
  });

  it("zeigt 7 Haltestellen im Linienverlauf", () => {
    render(<AuftragDetailPage />);
    const stops = ["Lager C", "Lager A", "Lager H", "Halle A", "Lager F", "Lager E", "Hauptgebäude"];
    stops.forEach((stop) => expect(screen.getAllByText(stop).length).toBeGreaterThan(0));
  });

  it("zeigt Button 'Hinweis setzen'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Hinweis setzen")).toBeInTheDocument();
  });

  it("zeigt Button 'Linie bearbeiten'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Linie bearbeiten")).toBeInTheDocument();
  });

  it("zeigt Button 'Linie löschen'", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("Linie löschen")).toBeInTheDocument();
  });

  it("zeigt 'In Karte anzeigen' Button", () => {
    render(<AuftragDetailPage />);
    expect(screen.getByText("In Karte anzeigen")).toBeInTheDocument();
  });

  it("← Zurück-Button navigiert zu /auftraege", () => {
    render(<AuftragDetailPage />);
    fireEvent.click(screen.getByText("←"));
    expect(mockPush).toHaveBeenCalledWith("/auftraege");
  });

  it("zeigt KEINE Lieferungs-Timeline", () => {
    render(<AuftragDetailPage />);
    expect(screen.queryByText("Lieferungsverlauf")).not.toBeInTheDocument();
    expect(screen.queryByText("Scan Beladestation")).not.toBeInTheDocument();
  });

  it("zeigt KEINEN 'Auftrag stornieren' Button (MT-Ansicht hat andere Aktionen)", () => {
    render(<AuftragDetailPage />);
    expect(screen.queryByRole("button", { name: "Auftrag stornieren" })).not.toBeInTheDocument();
  });
});
