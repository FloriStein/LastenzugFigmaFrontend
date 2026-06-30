import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragErstellenDialog } from "./AuftragErstellenDialog";

function renderOpen(overrides: Partial<Parameters<typeof AuftragErstellenDialog>[0]> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  };
  return { ...render(<AuftragErstellenDialog {...props} />), ...props };
}

function fillRequired(von = "Lager A", ziel = "Hauptgebäude", auftraggeber = "Max M.") {
  fireEvent.change(screen.getByLabelText(/^Von$/i), { target: { value: von } });
  fireEvent.change(screen.getByLabelText(/^Ziel$/i), { target: { value: ziel } });
  fireEvent.change(screen.getByLabelText(/^Auftraggeber$/i), { target: { value: auftraggeber } });
}

describe("AuftragErstellenDialog — Sichtbarkeit", () => {
  it("rendert nicht wenn open=false", () => {
    render(<AuftragErstellenDialog open={false} onOpenChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByText("Neuen Auftrag erstellen")).not.toBeInTheDocument();
  });

  it("zeigt Titel 'Neuen Auftrag erstellen' wenn open=true", () => {
    renderOpen();
    expect(screen.getByText("Neuen Auftrag erstellen")).toBeInTheDocument();
  });
});

describe("AuftragErstellenDialog — Formularfelder", () => {
  it("zeigt Art-Dropdown mit 'Lieferauftrag' als Default", () => {
    renderOpen();
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("Lieferauftrag");
  });

  it("zeigt alle drei Auftragsarten im Dropdown", () => {
    renderOpen();
    expect(screen.getByRole("option", { name: "Lieferauftrag" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mitarbeitertransport" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Leerfahrt" })).toBeInTheDocument();
  });

  it("zeigt Abfahrt-Feld mit Placeholder '08:30'", () => {
    renderOpen();
    expect(screen.getByPlaceholderText("08:30")).toBeInTheDocument();
  });

  it("zeigt 'Abbrechen' und 'Erstellen' Buttons", () => {
    renderOpen();
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Erstellen" })).toBeInTheDocument();
  });
});

describe("AuftragErstellenDialog — Validierung", () => {
  it("'Erstellen' initial deaktiviert (leere Pflichtfelder)", () => {
    renderOpen();
    expect(screen.getByRole("button", { name: "Erstellen" })).toBeDisabled();
  });

  it("'Erstellen' deaktiviert wenn nur 'Von' gefüllt", () => {
    renderOpen();
    fireEvent.change(screen.getByLabelText(/^Von$/i), { target: { value: "Lager A" } });
    expect(screen.getByRole("button", { name: "Erstellen" })).toBeDisabled();
  });

  it("'Erstellen' deaktiviert wenn nur 'Ziel' gefüllt", () => {
    renderOpen();
    fireEvent.change(screen.getByLabelText(/^Ziel$/i), { target: { value: "Gebäude B" } });
    expect(screen.getByRole("button", { name: "Erstellen" })).toBeDisabled();
  });

  it("'Erstellen' deaktiviert wenn Von + Ziel aber kein Auftraggeber", () => {
    renderOpen();
    fireEvent.change(screen.getByLabelText(/^Von$/i), { target: { value: "Lager A" } });
    fireEvent.change(screen.getByLabelText(/^Ziel$/i), { target: { value: "Gebäude B" } });
    expect(screen.getByRole("button", { name: "Erstellen" })).toBeDisabled();
  });

  it("'Erstellen' aktiviert wenn Von, Ziel und Auftraggeber gefüllt", () => {
    renderOpen();
    fillRequired();
    expect(screen.getByRole("button", { name: "Erstellen" })).toBeEnabled();
  });
});

describe("AuftragErstellenDialog — Submit", () => {
  it("Klick auf 'Erstellen' ruft onSubmit mit Formulardaten auf", () => {
    const onSubmit = vi.fn();
    renderOpen({ onSubmit });
    fillRequired("Lager X", "Tor 5", "Julia K.");
    fireEvent.click(screen.getByRole("button", { name: "Erstellen" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ von: "Lager X", ziel: "Tor 5", auftraggeber: "Julia K." })
    );
  });

  it("onSubmit enthält status='geplant'", () => {
    const onSubmit = vi.fn();
    renderOpen({ onSubmit });
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: "Erstellen" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ status: "geplant" }));
  });

  it("Art-Auswahl 'Leerfahrt' landet in onSubmit.art", () => {
    const onSubmit = vi.fn();
    renderOpen({ onSubmit });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Leerfahrt" } });
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: "Erstellen" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ art: "Leerfahrt" }));
  });

  it("'Erstellen' schließt den Dialog (onOpenChange(false))", () => {
    const onOpenChange = vi.fn();
    renderOpen({ onOpenChange });
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: "Erstellen" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Klick auf 'Erstellen' wenn deaktiviert ruft onSubmit nicht auf", () => {
    const onSubmit = vi.fn();
    renderOpen({ onSubmit });
    fireEvent.click(screen.getByRole("button", { name: "Erstellen" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("AuftragErstellenDialog — Abbrechen", () => {
  it("'Abbrechen' schließt den Dialog", () => {
    const onOpenChange = vi.fn();
    renderOpen({ onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("'Abbrechen' ruft onSubmit nicht auf", () => {
    const onSubmit = vi.fn();
    renderOpen({ onSubmit });
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
