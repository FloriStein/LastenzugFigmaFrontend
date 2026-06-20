import { render, screen, fireEvent } from "@testing-library/react";
import KartePage from "./page";

const mockPush = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/features/MapCanvas", () => ({
  MapCanvas: () => <div data-testid="map-canvas" />,
}));

vi.mock("@/components/features/RoutenzugListPanel", () => ({
  RoutenzugListPanel: ({
    routenzüge,
    onSelect,
  }: {
    routenzüge: { id: string; name: string }[];
    onSelect: (id: string) => void;
  }) => (
    <div>
      {routenzüge.map((rz) => (
        <button key={rz.id} onClick={() => onSelect(rz.id)}>
          {rz.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/layout/KarteShell", () => ({
  KarteShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => vi.clearAllMocks());

describe("SC-05-Link — Karte navigiert zur Detailseite", () => {
  it("Klick auf Routenzug A navigiert zu /routenzug/RZ-A", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug A" }));
    expect(mockPush).toHaveBeenCalledWith("/routenzug/RZ-A");
  });

  it("Klick auf Routenzug B navigiert zu /routenzug/RZ-B", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug B" }));
    expect(mockPush).toHaveBeenCalledWith("/routenzug/RZ-B");
  });

  it("Klick auf Routenzug C navigiert zu /routenzug/RZ-C", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug C" }));
    expect(mockPush).toHaveBeenCalledWith("/routenzug/RZ-C");
  });

  it("router.push wird genau einmal aufgerufen", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug A" }));
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("alle drei Routenzüge werden angezeigt", () => {
    render(<KartePage />);
    expect(screen.getByRole("button", { name: "Routenzug A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Routenzug B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Routenzug C" })).toBeInTheDocument();
  });
});
