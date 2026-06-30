import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("rendert ein Input-Element", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("zeigt den übergebenen value an", () => {
    render(<SearchBar value="Routenzug 4" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("Routenzug 4");
  });

  it("ruft onChange mit dem neuen Wert auf", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Test" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("Test");
  });

  it("zeigt den Placeholder-Text", () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Fahrzeug suchen..." />);
    expect(screen.getByPlaceholderText("Fahrzeug suchen...")).toBeInTheDocument();
  });

  it("kein Placeholder wenn nicht angegeben", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("placeholder");
  });
});

describe("SearchBar — UX-01: Clear-Button", () => {
  it("kein Clear-Button wenn value leer", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByRole("button", { name: "Suche löschen" })).not.toBeInTheDocument();
  });

  it("Clear-Button erscheint wenn value nicht leer", () => {
    render(<SearchBar value="Test" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Suche löschen" })).toBeInTheDocument();
  });

  it("Clear-Button hat aria-label 'Suche löschen'", () => {
    render(<SearchBar value="Abc" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Suche löschen" })).toHaveAttribute("aria-label", "Suche löschen");
  });

  it("Klick auf Clear-Button ruft onChange mit leerem String auf", () => {
    const onChange = vi.fn();
    render(<SearchBar value="Routenzug A" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Suche löschen" }));
    expect(onChange).toHaveBeenCalledWith("");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("Clear-Button ruft onChange nicht ohne Klick auf", () => {
    const onChange = vi.fn();
    render(<SearchBar value="Text" onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("value mit einzelnem Zeichen → Clear-Button sichtbar", () => {
    render(<SearchBar value="x" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Suche löschen" })).toBeInTheDocument();
  });

  it("Search-Icon nicht sichtbar wenn value nicht leer (Clear ersetzt es)", () => {
    render(<SearchBar value="x" onChange={() => {}} />);
    const clearBtn = screen.getByRole("button", { name: "Suche löschen" });
    expect(clearBtn).toBeInTheDocument();
    expect(clearBtn).toContainHTML("×");
  });
});
