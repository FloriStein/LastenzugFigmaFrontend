import { render, screen, fireEvent } from "@testing-library/react";
import AuftragDetailPage from "./page";

const mockPush = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => vi.clearAllMocks());

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
