import { render, screen, fireEvent } from "@testing-library/react";
import type { Routenzug } from "@/types/routenzug";

const mockDivIcon = vi.hoisted(() => vi.fn((opts: unknown) => opts));
const mockFitBounds = vi.hoisted(() => vi.fn());

vi.mock("leaflet/dist/leaflet.css", () => ({}));

vi.mock("leaflet", () => ({
  default: {
    CRS: { Simple: {} },
    divIcon: mockDivIcon,
    latLng: (y: number, x: number) => ({ lat: y, lng: x }),
    latLngBounds: () => ({}),
  },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  SVGOverlay: () => null,
  Marker: ({
    eventHandlers,
    icon,
  }: {
    eventHandlers?: { click?: () => void };
    icon?: { html?: string };
  }) => (
    <button
      data-testid="marker"
      data-icon-html={icon?.html ?? ""}
      onClick={eventHandlers?.click}
    />
  ),
  useMap: () => ({ fitBounds: mockFitBounds }),
}));

const { MapCanvas } = await import("./MapCanvas");

const MOCK_RZ: Routenzug[] = [
  { id: "rz-a", name: "Routenzug A", aufträge: ["#1"], status: "fahrt-unterbrochen",  position: { x: 100, y: 200 } },
  { id: "rz-b", name: "Routenzug B", aufträge: ["#2"], status: "fährt-automatisiert", position: { x: 300, y: 400 } },
  { id: "rz-c", name: "Routenzug C", aufträge: [],      status: "lädt", ladestand: 71, position: { x: 500, y: 600 } },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("MapCanvas — Grundstruktur", () => {
  it("rendert den Map-Container", () => {
    render(<MapCanvas routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("rendert einen Marker pro Routenzug", () => {
    render(<MapCanvas routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(screen.getAllByTestId("marker")).toHaveLength(3);
  });

  it("leere Routenzüge-Liste rendert keinen Marker", () => {
    render(<MapCanvas routenzüge={[]} onSelect={vi.fn()} />);
    expect(screen.queryAllByTestId("marker")).toHaveLength(0);
  });

  it("einzelner Routenzug rendert genau einen Marker", () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[0]]} onSelect={vi.fn()} />);
    expect(screen.getAllByTestId("marker")).toHaveLength(1);
  });
});

describe("MapCanvas — Klick-Interaktion", () => {
  it("Klick auf ersten Marker ruft onSelect mit 'rz-a' auf", () => {
    const onSelect = vi.fn();
    render(<MapCanvas routenzüge={MOCK_RZ} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByTestId("marker")[0]);
    expect(onSelect).toHaveBeenCalledWith("rz-a");
  });

  it("Klick auf zweiten Marker ruft onSelect mit 'rz-b' auf", () => {
    const onSelect = vi.fn();
    render(<MapCanvas routenzüge={MOCK_RZ} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByTestId("marker")[1]);
    expect(onSelect).toHaveBeenCalledWith("rz-b");
  });

  it("Klick auf dritten Marker ruft onSelect mit 'rz-c' auf", () => {
    const onSelect = vi.fn();
    render(<MapCanvas routenzüge={MOCK_RZ} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByTestId("marker")[2]);
    expect(onSelect).toHaveBeenCalledWith("rz-c");
  });
});

describe("MapCanvas — Icon-Varianten", () => {
  it('fahrt-unterbrochen verwendet Farbe #C55141 (routenzug-problem)', () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[0]]} onSelect={vi.fn()} />);
    const marker = screen.getByTestId("marker");
    expect(marker.getAttribute("data-icon-html")).toContain("#C55141");
  });

  it('fährt-automatisiert (nicht ausgewählt) verwendet Farbe #2A2F3B (normal)', () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[1]]} onSelect={vi.fn()} />);
    const marker = screen.getByTestId("marker");
    expect(marker.getAttribute("data-icon-html")).toContain("#2A2F3B");
  });

  it('lädt (nicht ausgewählt) verwendet Farbe #2A2F3B (normal)', () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[2]]} onSelect={vi.fn()} />);
    const marker = screen.getByTestId("marker");
    expect(marker.getAttribute("data-icon-html")).toContain("#2A2F3B");
  });

  it('ausgewählter Routenzug verwendet Farbe #146AA1 (selected)', () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[1]]} selectedId="rz-b" onSelect={vi.fn()} />);
    const marker = screen.getByTestId("marker");
    expect(marker.getAttribute("data-icon-html")).toContain("#146AA1");
  });

  it("selectedId hat Vorrang: fahrt-unterbrochen + selected → selected-Icon", () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[0]]} selectedId="rz-a" onSelect={vi.fn()} />);
    const marker = screen.getByTestId("marker");
    expect(marker.getAttribute("data-icon-html")).toContain("#146AA1");
    expect(marker.getAttribute("data-icon-html")).not.toContain("#C55141");
  });

  it("nicht-ausgewählter Routenzug neben ausgewähltem behält eigene Farbe", () => {
    render(<MapCanvas routenzüge={MOCK_RZ} selectedId="rz-b" onSelect={vi.fn()} />);
    const markers = screen.getAllByTestId("marker");
    // rz-a: fahrt-unterbrochen → problem (rot)
    expect(markers[0].getAttribute("data-icon-html")).toContain("#C55141");
    // rz-b: selected (blau)
    expect(markers[1].getAttribute("data-icon-html")).toContain("#146AA1");
    // rz-c: normal (dunkel)
    expect(markers[2].getAttribute("data-icon-html")).toContain("#2A2F3B");
  });
});

describe("MapCanvas — Leaflet-Setup", () => {
  it("ruft L.divIcon für jeden Routenzug auf", () => {
    render(<MapCanvas routenzüge={MOCK_RZ} onSelect={vi.fn()} />);
    expect(mockDivIcon).toHaveBeenCalledTimes(3);
  });

  it("divIcon wird mit className '' aufgerufen", () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[0]]} onSelect={vi.fn()} />);
    expect(mockDivIcon).toHaveBeenCalledWith(
      expect.objectContaining({ className: "" })
    );
  });

  it("routenzug-Icon hat iconSize [28, 31]", () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[1]]} onSelect={vi.fn()} />);
    expect(mockDivIcon).toHaveBeenCalledWith(
      expect.objectContaining({ iconSize: [28, 31] })
    );
  });

  it("routenzug-Icon hat iconAnchor [14, 31]", () => {
    render(<MapCanvas routenzüge={[MOCK_RZ[1]]} onSelect={vi.fn()} />);
    expect(mockDivIcon).toHaveBeenCalledWith(
      expect.objectContaining({ iconAnchor: [14, 31] })
    );
  });
});
