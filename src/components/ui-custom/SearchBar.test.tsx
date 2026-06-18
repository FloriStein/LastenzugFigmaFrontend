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
