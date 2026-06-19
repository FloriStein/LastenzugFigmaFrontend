import { render, screen, fireEvent } from "@testing-library/react";
import { RoutenzugListPanel } from "./RoutenzugListPanel";
import type { Routenzug } from "@/types/routenzug";

const MOCK_RZ: Routenzug[] = [
  { id: "rz-a", name: "Routenzug A", aufträge: ["#212", "#209"], status: "fahrt-unterbrochen", position: { x: 100, y: 200 } },
  { id: "rz-b", name: "Routenzug B", aufträge: ["#210"],          status: "fährt-automatisiert", position: { x: 300, y: 400 } },
  { id: "rz-c", name: "Routenzug C", aufträge: [],                status: "lädt", ladestand: 71,  position: { x: 500, y: 600 } },
];

describe("RoutenzugListPanel — Rendering", () => {
  it('zeigt Überschrift "Routenzüge"', () => {
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(screen.getByText("Routenzüge")).toBeInTheDocument();
  });

  it("zeigt drei Cards für drei Routenzüge", () => {
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
    expect(screen.getByText("Routenzug B")).toBeInTheDocument();
    expect(screen.getByText("Routenzug C")).toBeInTheDocument();
  });

  it("leere Liste zeigt Überschrift aber keine Cards", () => {
    render(<RoutenzugListPanel routenzüge={[]} onSelect={vi.fn()} />);
    expect(screen.getByText("Routenzüge")).toBeInTheDocument();
    expect(screen.queryByText(/Routenzug [ABC]/)).not.toBeInTheDocument();
  });

  it("zeigt StatusBadge-Label jeder Card", () => {
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(screen.getByText("Fahrt unterbrochen")).toBeInTheDocument();
    expect(screen.getByText("fährt automatisiert")).toBeInTheDocument();
    expect(screen.getByText("lädt (71%)")).toBeInTheDocument();
  });

  it('zeigt "keine Lieferungen" für Routenzug C', () => {
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(screen.getByText("keine Lieferungen")).toBeInTheDocument();
  });

  it("zeigt einen einzelnen Routenzug korrekt", () => {
    const single: Routenzug[] = [
      { id: "rz-x", name: "Solo", aufträge: ["#1"], status: "fährt-automatisiert", position: { x: 0, y: 0 } },
    ];
    render(<RoutenzugListPanel routenzüge={single} onSelect={vi.fn()} />);
    expect(screen.getByText("Solo")).toBeInTheDocument();
  });
});

describe("RoutenzugListPanel — Card-Positionen", () => {
  it("erste Card hat top: 140px", () => {
    const { container } = render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    const wrappers = container.querySelectorAll<HTMLElement>("[style]");
    expect(wrappers[0]).toHaveStyle({ top: "140px" });
  });

  it("zweite Card hat top: 271px", () => {
    const { container } = render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    const wrappers = container.querySelectorAll<HTMLElement>("[style]");
    expect(wrappers[1]).toHaveStyle({ top: "271px" });
  });

  it("dritte Card hat top: 402px", () => {
    const { container } = render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    const wrappers = container.querySelectorAll<HTMLElement>("[style]");
    expect(wrappers[2]).toHaveStyle({ top: "402px" });
  });
});

describe("RoutenzugListPanel — Interaktion", () => {
  it("Klick auf erste Card ruft onSelect mit 'rz-a' auf", () => {
    const onSelect = vi.fn();
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Routenzug A").closest("div")!);
    expect(onSelect).toHaveBeenCalledWith("rz-a");
  });

  it("Klick auf zweite Card ruft onSelect mit 'rz-b' auf", () => {
    const onSelect = vi.fn();
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Routenzug B").closest("div")!);
    expect(onSelect).toHaveBeenCalledWith("rz-b");
  });

  it("Klick auf Close-Button ruft onClose auf", () => {
    const onClose = vi.fn();
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Panel schließen" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("kein Fehler wenn onClose nicht angegeben und Close-Button geklickt", () => {
    render(<RoutenzugListPanel routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Panel schließen" }))
    ).not.toThrow();
  });
});
