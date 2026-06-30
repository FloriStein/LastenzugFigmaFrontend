import { render } from "@testing-library/react";
import HomePage from "./page";

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

beforeEach(() => vi.clearAllMocks());

describe("RP-01 — RootPage Redirect", () => {
  it("ruft redirect('/login') auf", () => {
    render(<HomePage />);
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("ruft redirect genau einmal auf", () => {
    render(<HomePage />);
    expect(mockRedirect).toHaveBeenCalledTimes(1);
  });

  it("rendert keinen sichtbaren Inhalt", () => {
    const { container } = render(<HomePage />);
    expect(container.firstChild).toBeNull();
  });

  it("ruft kein anderes Ziel als /login auf", () => {
    render(<HomePage />);
    expect(mockRedirect).not.toHaveBeenCalledWith("/");
    expect(mockRedirect).not.toHaveBeenCalledWith("/karte");
    expect(mockRedirect).not.toHaveBeenCalledWith("/ereignisse");
  });
});
