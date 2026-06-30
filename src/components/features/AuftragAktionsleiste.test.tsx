import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragAktionsleiste } from "./AuftragAktionsleiste";

const BASE_PROPS = {
  onBearbeiten: vi.fn(),
  onStornieren: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("AuftragAktionsleiste — Grundstruktur", () => {
  it("zeigt Button 'Auftrag bearbeiten'", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: "Auftrag bearbeiten" })).toBeInTheDocument();
  });

  it("zeigt Button 'Auftrag stornieren'", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: "Auftrag stornieren" })).toBeInTheDocument();
  });

  it("zeigt genau 2 Buttons im Initialzustand", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});

describe("AuftragAktionsleiste — Callbacks", () => {
  it("Klick auf 'Auftrag bearbeiten' ruft onBearbeiten auf", () => {
    const onBearbeiten = vi.fn();
    render(<AuftragAktionsleiste {...BASE_PROPS} onBearbeiten={onBearbeiten} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag bearbeiten" }));
    expect(onBearbeiten).toHaveBeenCalledTimes(1);
  });

  it("Erster Klick auf 'Auftrag stornieren' ruft onStornieren NICHT sofort auf", () => {
    const onStornieren = vi.fn();
    render(<AuftragAktionsleiste {...BASE_PROPS} onStornieren={onStornieren} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    expect(onStornieren).not.toHaveBeenCalled();
  });

  it("Zweistufige Bestätigung ruft onStornieren auf", () => {
    const onStornieren = vi.fn();
    render(<AuftragAktionsleiste {...BASE_PROPS} onStornieren={onStornieren} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    fireEvent.click(screen.getByRole("button", { name: "Ja, stornieren" }));
    expect(onStornieren).toHaveBeenCalledTimes(1);
  });

  it("'Auftrag bearbeiten' ruft nicht onStornieren auf", () => {
    const onStornieren = vi.fn();
    render(<AuftragAktionsleiste {...BASE_PROPS} onStornieren={onStornieren} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag bearbeiten" }));
    expect(onStornieren).not.toHaveBeenCalled();
  });

  it("'Auftrag stornieren' ruft nicht onBearbeiten auf", () => {
    const onBearbeiten = vi.fn();
    render(<AuftragAktionsleiste {...BASE_PROPS} onBearbeiten={onBearbeiten} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    expect(onBearbeiten).not.toHaveBeenCalled();
  });

  it("Mehrfachklick ruft Callback entsprechend oft auf", () => {
    const onBearbeiten = vi.fn();
    render(<AuftragAktionsleiste {...BASE_PROPS} onBearbeiten={onBearbeiten} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag bearbeiten" }));
    fireEvent.click(screen.getByRole("button", { name: "Auftrag bearbeiten" }));
    expect(onBearbeiten).toHaveBeenCalledTimes(2);
  });
});

describe("AuftragAktionsleiste — Bestätigungs-UI", () => {
  it("Erster Klick zeigt Bestätigungsfrage", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    expect(screen.getByText("Auftrag wirklich stornieren?")).toBeInTheDocument();
  });

  it("Nach erstem Klick erscheinen 'Ja, stornieren' und 'Abbrechen'", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    expect(screen.getByRole("button", { name: "Ja, stornieren" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument();
  });

  it("'Auftrag stornieren' Button verschwindet nach erstem Klick", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    expect(screen.queryByRole("button", { name: "Auftrag stornieren" })).not.toBeInTheDocument();
  });

  it("'Abbrechen' setzt Confirmation-State zurück", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(screen.getByRole("button", { name: "Auftrag stornieren" })).toBeInTheDocument();
    expect(screen.queryByText("Auftrag wirklich stornieren?")).not.toBeInTheDocument();
  });

  it("'Abbrechen' ruft onStornieren nicht auf", () => {
    const onStornieren = vi.fn();
    render(<AuftragAktionsleiste {...BASE_PROPS} onStornieren={onStornieren} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onStornieren).not.toHaveBeenCalled();
  });

  it("Nach 'Ja, stornieren' verschwindet Bestätigungs-UI", () => {
    render(<AuftragAktionsleiste {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: "Auftrag stornieren" }));
    fireEvent.click(screen.getByRole("button", { name: "Ja, stornieren" }));
    expect(screen.queryByText("Auftrag wirklich stornieren?")).not.toBeInTheDocument();
  });
});

describe("AuftragAktionsleiste — Styling", () => {
  it("'Auftrag bearbeiten' hat blauen Hintergrund (bg-blue-primary)", () => {
    const { container } = render(<AuftragAktionsleiste {...BASE_PROPS} />);
    const btn = container.querySelector('[class*="bg-blue-primary"]');
    expect(btn).toBeInTheDocument();
    expect(btn?.textContent).toContain("Auftrag bearbeiten");
  });

  it("'Auftrag stornieren' hat roten Hintergrund (bg-red-600)", () => {
    const { container } = render(<AuftragAktionsleiste {...BASE_PROPS} />);
    const btn = container.querySelector('[class*="bg-red-600"]');
    expect(btn).toBeInTheDocument();
    expect(btn?.textContent).toContain("Auftrag stornieren");
  });
});
