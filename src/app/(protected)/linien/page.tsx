import { KarteShell } from "@/components/layout/KarteShell";

interface Station {
  id: string;
  label: string;
  x: number;
  y: number;
  route: "rot" | "gruen" | "beide";
}

const STATIONS: Station[] = [
  { id: "hauptgebaeude",  label: "Hauptgebäude",      x: 400, y: 300, route: "beide" },
  { id: "lager-a",        label: "Lager A",            x: 160, y: 180, route: "rot" },
  { id: "lager-h",        label: "Lager H",            x: 240, y: 240, route: "rot" },
  { id: "lager-c",        label: "Lager C",            x: 280, y: 380, route: "rot" },
  { id: "haltestelle-n",  label: "N",                  x: 200, y: 440, route: "rot" },
  { id: "lager-e",        label: "Lager E",            x: 580, y: 160, route: "gruen" },
  { id: "lager-f",        label: "Lager F",            x: 520, y: 220, route: "gruen" },
  { id: "haltestelle-o",  label: "O",                  x: 540, y: 380, route: "gruen" },
  { id: "haltestelle-m",  label: "M",                  x: 580, y: 440, route: "gruen" },
  { id: "haltestelle-p",  label: "P",                  x: 620, y: 500, route: "gruen" },
];

const ROUTE_ROT: [number, number][] = [
  [160, 180], [240, 240], [400, 300], [280, 380], [200, 440],
];

const ROUTE_GRUEN: [number, number][] = [
  [580, 160], [520, 220], [400, 300], [540, 380], [580, 440], [620, 500],
];

function toPolyline(points: [number, number][]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function LinienPage() {
  return (
    <KarteShell activeItem="linien">
      <div className="flex-1 bg-[#F5F5F5] h-full p-8">
        <h1 className="text-[22px] font-bold text-black mb-4">Linienübersicht</h1>

        <div className="flex gap-4 mb-6">
          <div className="bg-[#D8D8D8] rounded-[33px] px-5 py-2 text-[14px] font-medium text-black">
            Hauptstandort
          </div>
          <div className="bg-[#D8D8D8] rounded-[33px] px-5 py-2 text-[14px] font-medium text-black">
            Standort B
          </div>
        </div>

        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[#DB4C4C] rounded" />
            <span className="text-[13px] text-black">Route Rot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[#449D3C] rounded" />
            <span className="text-[13px] text-black">Route Grün</span>
          </div>
        </div>

        <svg
          viewBox="0 0 760 600"
          className="w-full max-w-[760px] h-auto"
          aria-label="Linienübersicht SVG"
        >
          <polyline
            points={toPolyline(ROUTE_ROT)}
            stroke="#DB4C4C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={toPolyline(ROUTE_GRUEN)}
            stroke="#449D3C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {STATIONS.map((s) => {
            const strokeColor =
              s.route === "rot"
                ? "#DB4C4C"
                : s.route === "gruen"
                ? "#449D3C"
                : "#146AA1";
            return (
              <g key={s.id}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={14}
                  fill="white"
                  stroke={strokeColor}
                  strokeWidth="3"
                />
                <text
                  x={s.x}
                  y={s.y + 28}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#000"
                  fontFamily="Inter, sans-serif"
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </KarteShell>
  );
}
