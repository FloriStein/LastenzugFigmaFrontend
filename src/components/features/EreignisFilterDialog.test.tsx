import { render, screen, fireEvent } from "@testing-library/react";
import { EreignisFilterDialog } from "./EreignisFilterDialog";
import type { EreignisFilter } from "@/types/ereignis";

const EMPTY_FILTER: EreignisFilter = { status: [], priorität: [], fahrzeug: "" };

function renderOpen(overrides: Partial<Parameters<typeof EreignisFilterDialog>[0]> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    initialFilter: EMPTY_FILTER,
    onApply: vi.fn(),
    ...overrides,
  };
  return { ...render(<EreignisFilterDialog {...props} />), ...props };
}

describe("EreignisFilterDialog — Sichtbarkeit", () => {
  it("rendert nicht wenn open=false", () => {
    render(<EreignisFilterDialog open={false} onOpenChange={vi.fn()} initialFilter={EMPTY_FILTER} onApply={vi.fn()} />);
    expect(screen.queryByText("Filter")).not.toBeInTheDocument();
  });

  it("zeigt Titel 'Filter' wenn open=true", () => {
    renderOpen();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("zeigt 'Anwenden' und 'Abbrechen' Buttons", () => {
    renderOpen();
    expect(screen.getByRole("button", { name: "Anwenden" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument();
  });
});

describe("EreignisFilterDialog — Status-Checkboxen", () => {
  it("zeigt 4 Status-Checkboxen", () => {
    renderOpen();
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(4);
  });

  it("alle Status-Checkboxen initial deaktiviert (leerer Filter)", () => {
    renderOpen();
    screen.getAllByRole("checkbox").forEach((cb) => {
      expect(cb).not.toBeChecked();
    });
  });

  it("initialFilter mit status=[neu] → 'Neu' vorausgewählt", () => {
    renderOpen({ initialFilter: { ...EMPTY_FILTER, status: ["neu"] } });
    expect(screen.getByRole("checkbox", { name: "Neu" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "In Bearbeitung" })).not.toBeChecked();
  });

  it("Klick auf 'Neu' aktiviert die Checkbox", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("checkbox", { name: "Neu" }));
    expect(screen.getByRole("checkbox", { name: "Neu" })).toBeChecked();
  });

  it("zweiter Klick auf aktivierte Checkbox deaktiviert sie", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("checkbox", { name: "In Bearbeitung" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "In Bearbeitung" }));
    expect(screen.getByRole("checkbox", { name: "In Bearbeitung" })).not.toBeChecked();
  });

  it("mehrere Status gleichzeitig aktivierbar", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("checkbox", { name: "Neu" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Warten" }));
    expect(screen.getByRole("checkbox", { name: "Neu" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Warten" })).toBeChecked();
  });
});

describe("EreignisFilterDialog — Priorität-Buttons", () => {
  it("zeigt 4 Priorität-Buttons (1–4)", () => {
    renderOpen();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
  });

  it("initialFilter mit priorität=[3] → Button 3 hat aktive Klasse", () => {
    renderOpen({ initialFilter: { ...EMPTY_FILTER, priorität: [3] } });
    expect(screen.getByRole("button", { name: "3" })).toHaveClass("bg-blue-primary");
    expect(screen.getByRole("button", { name: "1" })).not.toHaveClass("bg-blue-primary");
  });

  it("Klick auf Priorität-Button 2 wählt ihn aus", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByRole("button", { name: "2" })).toHaveClass("bg-blue-primary");
  });

  it("zweiter Klick auf aktiven Priorität-Button deaktiviert ihn", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    expect(screen.getByRole("button", { name: "4" })).not.toHaveClass("bg-blue-primary");
  });
});

describe("EreignisFilterDialog — Fahrzeug-Input", () => {
  it("zeigt ein Fahrzeug-Textfeld", () => {
    renderOpen();
    expect(screen.getByPlaceholderText("z.B. Routenzug A")).toBeInTheDocument();
  });

  it("initialFilter.fahrzeug = 'Routenzug B' → Feld vorausgefüllt", () => {
    renderOpen({ initialFilter: { ...EMPTY_FILTER, fahrzeug: "Routenzug B" } });
    expect(screen.getByPlaceholderText("z.B. Routenzug A")).toHaveValue("Routenzug B");
  });

  it("Eingabe im Fahrzeug-Feld aktualisiert den Wert", () => {
    renderOpen();
    fireEvent.change(screen.getByPlaceholderText("z.B. Routenzug A"), { target: { value: "Routenzug C" } });
    expect(screen.getByPlaceholderText("z.B. Routenzug A")).toHaveValue("Routenzug C");
  });
});

describe("EreignisFilterDialog — Anwenden", () => {
  it("'Anwenden' ruft onApply mit dem Draft-Filter auf", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("checkbox", { name: "Neu" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ status: ["neu"] }));
  });

  it("'Anwenden' schließt den Dialog (onOpenChange(false))", () => {
    const onOpenChange = vi.fn();
    renderOpen({ onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("'Anwenden' mit mehreren Selektionen übergibt alle", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("checkbox", { name: "Warten" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Abgeschlossen" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    const applied: EreignisFilter = onApply.mock.calls[0][0];
    expect(applied.status).toContain("warten");
    expect(applied.status).toContain("abgeschlossen");
  });

  it("'Anwenden' ohne Änderungen übergibt leeren Filter", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(onApply).toHaveBeenCalledWith(EMPTY_FILTER);
  });
});

describe("EreignisFilterDialog — Abbrechen", () => {
  it("'Abbrechen' ruft onApply nicht auf", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("checkbox", { name: "Neu" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onApply).not.toHaveBeenCalled();
  });

  it("'Abbrechen' schließt den Dialog", () => {
    const onOpenChange = vi.fn();
    renderOpen({ onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
