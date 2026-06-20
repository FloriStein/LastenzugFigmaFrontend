import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";

const mockPush = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  // Cookie-Jar zwischen Tests leeren:
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
});

describe("SC-01 — LoginPage — Grundstruktur", () => {
  it("zeigt Titel 'Login'", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("zeigt 4 Nutzer-Buttons", () => {
    render(<LoginPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });

  it("zeigt 'Matthias Muster'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Matthias Muster")).toBeInTheDocument();
  });

  it("zeigt 'Sabine Muster'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sabine Muster")).toBeInTheDocument();
  });

  it("zeigt 'Jonas Muster'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Jonas Muster")).toBeInTheDocument();
  });

  it("zeigt 'Gast'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Gast")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'MM' für Matthias Muster", () => {
    render(<LoginPage />);
    expect(screen.getByText("MM")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'SL' für Sabine Muster", () => {
    render(<LoginPage />);
    expect(screen.getByText("SL")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'MA' für Jonas Muster", () => {
    render(<LoginPage />);
    expect(screen.getByText("MA")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'GA' für Gast", () => {
    render(<LoginPage />);
    expect(screen.getByText("GA")).toBeInTheDocument();
  });

  it("weißes Card hat rounded-[10px]", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('[class*="rounded-\\[10px\\]"]')).toBeInTheDocument();
  });

  it("Overlay hat backdrop-blur", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('[class*="backdrop-blur"]')).toBeInTheDocument();
  });
});

describe("SC-01 — LoginPage — Navigation nach Login", () => {
  it("Klick auf Matthias Muster → navigiert zu /karte", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(mockPush).toHaveBeenCalledWith("/karte");
  });

  it("Klick auf Sabine Muster → navigiert zu /ereignisse", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(mockPush).toHaveBeenCalledWith("/ereignisse");
  });

  it("Klick auf Jonas Muster → navigiert zu /auftraege", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /jonas muster/i }));
    expect(mockPush).toHaveBeenCalledWith("/auftraege");
  });

  it("Klick auf Gast → navigiert zu /statistiken", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /^als gast anmelden$/i }));
    expect(mockPush).toHaveBeenCalledWith("/statistiken");
  });

  it("router.push wird genau einmal aufgerufen", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

function getCookieRole(): string {
  const match = document.cookie.match(/auth-token=x\.([^.]+)\.x/);
  if (!match) return "";
  return JSON.parse(atob(match[1])).role ?? "";
}

describe("SC-01 — LoginPage — Cookie wird gesetzt", () => {
  it("Klick setzt auth-token Cookie", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(document.cookie).toContain("auth-token=");
  });

  it("Cookie enthält 'operator' Rolle für Matthias Muster", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(getCookieRole()).toBe("operator");
  });

  it("Cookie enthält 'schichtleitung' Rolle für Sabine Muster", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(getCookieRole()).toBe("schichtleitung");
  });

  it("Cookie enthält 'mitarbeiter' Rolle für Jonas Muster", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /jonas muster/i }));
    expect(getCookieRole()).toBe("mitarbeiter");
  });

  it("Cookie enthält 'gast' Rolle für Gast", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /^als gast anmelden$/i }));
    expect(getCookieRole()).toBe("gast");
  });
});

describe("SC-01 — LoginPage — Edge Cases", () => {
  it("mehrfaches Klicken setzt Cookie und navigiert jedes Mal", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(mockPush).toHaveBeenCalledTimes(2);
  });

  it("rendert ohne Fehler ohne Interaktion", () => {
    expect(() => render(<LoginPage />)).not.toThrow();
  });
});

function getCookieName(): string {
  const match = document.cookie.match(/auth-token=x\.([^.]+)\.x/);
  if (!match) return "";
  return JSON.parse(atob(match[1])).name ?? "";
}

describe("SC-01 — LoginPage — Cookie enthält Name (RF-05)", () => {
  it("Cookie für Matthias Muster enthält name='Matthias Muster'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(getCookieName()).toBe("Matthias Muster");
  });

  it("Cookie für Sabine Muster enthält name='Sabine Muster'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(getCookieName()).toBe("Sabine Muster");
  });

  it("Cookie für Jonas Muster enthält name='Jonas Muster'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /jonas muster/i }));
    expect(getCookieName()).toBe("Jonas Muster");
  });

  it("Cookie für Gast enthält name='Gast'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /^als gast anmelden$/i }));
    expect(getCookieName()).toBe("Gast");
  });

  it("Payload enthält sowohl role als auch name", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    const match = document.cookie.match(/auth-token=x\.([^.]+)\.x/);
    const payload = JSON.parse(atob(match![1]));
    expect(payload.role).toBe("operator");
    expect(payload.name).toBe("Matthias Muster");
  });
});
