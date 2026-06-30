import { render, screen, fireEvent } from "@testing-library/react";
import EreignissePage from "./page";

const mockPush = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockGet.mockReturnValue(null);
});

describe("EreignissePage — Grundstruktur (RF-06)", () => {
  it("rendert Seitentitel 'Ereignisse'", () => {
    render(<EreignissePage />);
    expect(screen.getByRole("heading", { name: "Ereignisse" })).toBeInTheDocument();
  });

  it("zeigt die 3 Tabs Alle / Offen / Archiv", () => {
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Alle" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Offen" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Archiv" })).toBeInTheDocument();
  });

  it("zeigt initial alle Mock-Ereignisse (kein ?tab)", () => {
    render(<EreignissePage />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#95")).toBeInTheDocument();
  });

  it("Klick auf Ereignis-Row navigiert zur Detail-Seite", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getAllByRole("row")[0]);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/ereignisse/"));
  });
});

describe("EreignissePage — URL-Tab-Sync (RF-06)", () => {
  it("kein ?tab → 'Alle'-Tab ist aktiv", () => {
    mockGet.mockReturnValue(null);
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Alle" })).toHaveAttribute("aria-selected", "true");
  });

  it("?tab=offen → 'Offen'-Tab ist initial aktiv", () => {
    mockGet.mockReturnValue("offen");
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Offen" })).toHaveAttribute("aria-selected", "true");
  });

  it("?tab=archiv → 'Archiv'-Tab ist initial aktiv", () => {
    mockGet.mockReturnValue("archiv");
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Archiv" })).toHaveAttribute("aria-selected", "true");
  });

  it("ungültiger ?tab-Wert → Fallback zu 'Alle'", () => {
    mockGet.mockReturnValue("unbekannt");
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Alle" })).toHaveAttribute("aria-selected", "true");
  });

  it("?tab=offen → zeigt nur Ereignisse mit status neu/warten", () => {
    mockGet.mockReturnValue("offen");
    render(<EreignissePage />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#96")).toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
    expect(screen.queryByText("#95")).not.toBeInTheDocument();
  });

  it("?tab=archiv → zeigt nur abgeschlossene Ereignisse", () => {
    mockGet.mockReturnValue("archiv");
    render(<EreignissePage />);
    expect(screen.getByText("#95")).toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
  });

  it("?tab=alle → zeigt alle 7 Ereignisse", () => {
    mockGet.mockReturnValue("alle");
    render(<EreignissePage />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#99")).toBeInTheDocument();
    expect(screen.getByText("#95")).toBeInTheDocument();
  });
});

describe("EreignissePage — Tab-Wechsel nach Laden (RF-06)", () => {
  it("manueller Tab-Klick funktioniert weiterhin", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    expect(screen.getByText("#95")).toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
  });

  it("nach Tab-Wechsel zurück zu Alle → zeigt wieder alle", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    fireEvent.click(screen.getByRole("tab", { name: "Alle" }));
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#95")).toBeInTheDocument();
  });
});

describe("EreignissePage — FD-01: Filter-Dialog Integration", () => {
  it("zeigt 'neuer Filter' Button", () => {
    render(<EreignissePage />);
    expect(screen.getByRole("button", { name: /neuer Filter/i })).toBeInTheDocument();
  });

  it("Klick auf 'neuer Filter' öffnet FilterDialog (Titel 'Filter' sichtbar)", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("Filter-Dialog zeigt Status-Checkboxen", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    expect(screen.getByRole("checkbox", { name: "Neu" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Abgeschlossen" })).toBeInTheDocument();
  });

  it("'Abbrechen' im Dialog schließt ihn wieder", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByText("Filter")).not.toBeInTheDocument();
  });

  it("Filter auf status=abgeschlossen → nur #95 in der Liste", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Abgeschlossen" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(screen.getByText("#95")).toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
  });
});
