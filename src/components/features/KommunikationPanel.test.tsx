import { render, screen, fireEvent } from "@testing-library/react";
import { KommunikationPanel } from "./KommunikationPanel";

describe("KommunikationPanel — Idle-State (Standard)", () => {
  it("zeigt 'Fahrgastkommunikation' Text im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.getByText("Fahrgastkommunikation")).toBeInTheDocument();
  });

  it("zeigt 'Keine aktuellen Anfragen' im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.getByText("Keine aktuellen Anfragen")).toBeInTheDocument();
  });

  it("zeigt 'Durchsage tätigen' Button", () => {
    render(<KommunikationPanel />);
    expect(screen.getByRole("button", { name: "Durchsage tätigen" })).toBeInTheDocument();
  });

  it("zeigt 'Fahrgastkommunikation starten' Button", () => {
    render(<KommunikationPanel />);
    expect(
      screen.getByRole("button", { name: "Fahrgastkommunikation starten" })
    ).toBeInTheDocument();
  });

  it("kein Annehmen-Button im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.queryByRole("button", { name: "Annehmen" })).not.toBeInTheDocument();
  });

  it("kein Auflegen-Button im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.queryByRole("button", { name: "Auflegen" })).not.toBeInTheDocument();
  });
});

describe("KommunikationPanel — Eingehend-State", () => {
  it("Klick 'Fahrgastkommunikation starten' wechselt zu Eingehend", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByText(/eingehender/i)).toBeInTheDocument();
  });

  it("zeigt 'eingehender Videoanruf ...' Text", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByText(/eingehender/i)).toBeInTheDocument();
  });

  it("zeigt 'Videoanruf' als Bold-Text", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    const strong = screen.getByText("Videoanruf");
    expect(strong.tagName).toBe("STRONG");
  });

  it("zeigt Annehmen-Button im Eingehend-State", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByRole("button", { name: "Annehmen" })).toBeInTheDocument();
  });

  it("zeigt Ablehnen-Button im Eingehend-State", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByRole("button", { name: "Ablehnen" })).toBeInTheDocument();
  });

  it("zeigt Kamera-Vorschau (aria-label='Kamera-Vorschau')", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByLabelText("Kamera-Vorschau")).toBeInTheDocument();
  });

  it("'Keine aktuellen Anfragen' verschwindet im Eingehend-State", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.queryByText("Keine aktuellen Anfragen")).not.toBeInTheDocument();
  });
});

describe("KommunikationPanel — Aktiv-State (Annehmen)", () => {
  function renderAktiv() {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Annehmen" }));
  }

  it("Annehmen → zeigt 'Videoanruf' Timer-Text", () => {
    renderAktiv();
    expect(screen.getByText(/Videoanruf/)).toBeInTheDocument();
  });

  it("Annehmen → zeigt Haupt-Video (aria-label='Haupt-Video')", () => {
    renderAktiv();
    expect(screen.getByLabelText("Haupt-Video")).toBeInTheDocument();
  });

  it("Annehmen → zeigt Seiten-Video (aria-label='Seiten-Video')", () => {
    renderAktiv();
    expect(screen.getByLabelText("Seiten-Video")).toBeInTheDocument();
  });

  it("Annehmen → zeigt Auflegen-Button", () => {
    renderAktiv();
    expect(screen.getByRole("button", { name: "Auflegen" })).toBeInTheDocument();
  });

  it("Annehmen → Annehmen/Ablehnen-Buttons verschwinden", () => {
    renderAktiv();
    expect(screen.queryByRole("button", { name: "Annehmen" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ablehnen" })).not.toBeInTheDocument();
  });

  it("Auflegen → zurück zu Idle", () => {
    renderAktiv();
    fireEvent.click(screen.getByRole("button", { name: "Auflegen" }));
    expect(screen.getByText("Keine aktuellen Anfragen")).toBeInTheDocument();
  });
});

describe("KommunikationPanel — Ablehnen", () => {
  it("Ablehnen → zurück zu Idle", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Ablehnen" }));
    expect(screen.getByText("Keine aktuellen Anfragen")).toBeInTheDocument();
  });

  it("Ablehnen → kein Kamera-Vorschau mehr", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Ablehnen" }));
    expect(screen.queryByLabelText("Kamera-Vorschau")).not.toBeInTheDocument();
  });
});

describe("KommunikationPanel — onStateChange Callback", () => {
  it("ruft onStateChange('eingehend') beim Starten auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(onChange).toHaveBeenCalledWith("eingehend");
  });

  it("ruft onStateChange('aktiv') beim Annehmen auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Annehmen" }));
    expect(onChange).toHaveBeenCalledWith("aktiv");
  });

  it("ruft onStateChange('idle') beim Ablehnen auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Ablehnen" }));
    expect(onChange).toHaveBeenCalledWith("idle");
  });

  it("ruft onStateChange('idle') beim Auflegen auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Annehmen" }));
    fireEvent.click(screen.getByRole("button", { name: "Auflegen" }));
    expect(onChange).toHaveBeenCalledWith("idle");
  });

  it("kein Fehler ohne onStateChange-Prop", () => {
    expect(() => {
      render(<KommunikationPanel />);
    }).not.toThrow();
  });
});

describe("KommunikationPanel — AktionenPanel Tab-Badge Integration", () => {
  it("Kommunikation-Tab-Button existiert immer", () => {
    render(<KommunikationPanel />);
    expect(screen.getByRole("button", { name: "Fahrgastkommunikation starten" })).toBeInTheDocument();
  });
});
