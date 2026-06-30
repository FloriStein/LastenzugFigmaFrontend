import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/ereignisse",
}));

const BASE_PROPS = {
  userName: "Test User",
  onLogout: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("OR-01 — Sidebar Operator — NAV_CONFIG Karte + Linien", () => {
  it("zeigt Karte-Link für Operator (href=/karte)", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" />);
    const link = screen.getByRole("link", { name: /karte/i });
    expect(link).toHaveAttribute("href", "/karte");
  });

  it("zeigt Linien-Link für Operator (href=/linien)", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" />);
    const link = screen.getByRole("link", { name: /linien/i });
    expect(link).toHaveAttribute("href", "/linien");
  });

  it("zeigt Ereignisse-Link für Operator", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" />);
    expect(screen.getByRole("link", { name: /ereignisse/i })).toBeInTheDocument();
  });

  it("zeigt Aufträge-Link für Operator", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" />);
    expect(screen.getByRole("link", { name: /aufträge/i })).toBeInTheDocument();
  });

  it("zeigt Einstellungen-Link für Operator", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" />);
    expect(screen.getByRole("link", { name: /einstellungen/i })).toBeInTheDocument();
  });

  it("zeigt Benutzernamen an", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" userName="Max Mustermann" />);
    expect(screen.getByText("Max Mustermann")).toBeInTheDocument();
  });

  it("Abmelden-Button ruft onLogout auf", () => {
    const onLogout = vi.fn();
    render(<Sidebar {...BASE_PROPS} role="operator" onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button", { name: /abmelden/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});

describe("OR-01 — Sidebar Operator — Edge Cases", () => {
  it("Operator sieht KEIN Statistiken-Nav (nur Schichtleitung)", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" />);
    expect(screen.queryByRole("link", { name: /statistiken/i })).not.toBeInTheDocument();
  });

  it("Operator sieht KEINE Anzeigetafel (nur Mitarbeiter)", () => {
    render(<Sidebar {...BASE_PROPS} role="operator" />);
    expect(screen.queryByRole("link", { name: /anzeigetafel/i })).not.toBeInTheDocument();
  });
});

describe("OR-01 — Sidebar Mitarbeiter — hat KEIN Karte", () => {
  it("Mitarbeiter sieht keinen Karte-Link", () => {
    render(<Sidebar {...BASE_PROPS} role="mitarbeiter" />);
    expect(screen.queryByRole("link", { name: /^karte$/i })).not.toBeInTheDocument();
  });

  it("Mitarbeiter sieht Linien-Link (in Mitarbeiter-NAV enthalten)", () => {
    render(<Sidebar {...BASE_PROPS} role="mitarbeiter" />);
    expect(screen.getByRole("link", { name: /^linien$/i })).toHaveAttribute("href", "/linien");
  });

  it("Mitarbeiter sieht Aufträge-Link", () => {
    render(<Sidebar {...BASE_PROPS} role="mitarbeiter" />);
    expect(screen.getByRole("link", { name: /aufträge/i })).toBeInTheDocument();
  });

  it("Mitarbeiter sieht Anzeigetafel-Link", () => {
    render(<Sidebar {...BASE_PROPS} role="mitarbeiter" />);
    expect(screen.getByRole("link", { name: /anzeigetafel/i })).toBeInTheDocument();
  });
});

describe("OR-01 — Sidebar Schichtleitung", () => {
  it("Schichtleitung hat Karte-Link (war schon vor Sprint 12)", () => {
    render(<Sidebar {...BASE_PROPS} role="schichtleitung" />);
    expect(screen.getByRole("link", { name: /karte/i })).toHaveAttribute("href", "/karte");
  });

  it("Schichtleitung hat Statistiken-Link", () => {
    render(<Sidebar {...BASE_PROPS} role="schichtleitung" />);
    expect(screen.getByRole("link", { name: /statistiken/i })).toBeInTheDocument();
  });
});
