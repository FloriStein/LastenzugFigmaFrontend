"use client";

import { useEffect, useState } from "react";

interface Abfahrt {
  id: string;
  richtung: string;
  via: string;
  abfahrt: string;
  verspaetung?: string;
  hinweis?: string;
}

const MOCK_ABFAHRTEN: Abfahrt[] = [
  {
    id: "1",
    richtung: "Hauptgebäude",
    via: "via Lager H → Halle A → Lager F → Lager E",
    abfahrt: "in 9min",
    verspaetung: "1min verspätet",
  },
  {
    id: "2",
    richtung: "Hauptgebäude",
    via: "via Lager H → Lager F → Lager E",
    abfahrt: "in 2h 9min",
    hinweis: "Haltestelle Halle A entfällt",
  },
  {
    id: "3",
    richtung: "Lager M",
    via: "via Lager H → Hauptgebäude → Lager L",
    abfahrt: "in 3h 9min",
  },
];

function BusIcon() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="90" height="60" rx="10" fill="#9A9EA0" />
      <rect x="18" y="28" width="30" height="22" rx="4" fill="#E0E8EF" />
      <rect x="62" y="28" width="30" height="22" rx="4" fill="#E0E8EF" />
      <rect x="10" y="68" width="90" height="16" rx="4" fill="#646A79" />
      <circle cx="27" cy="92" r="10" fill="#2A2F3B" />
      <circle cx="83" cy="92" r="10" fill="#2A2F3B" />
    </svg>
  );
}

function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export default function AnzeigetafelPage() {
  const [uhrzeit, setUhrzeit] = useState(formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setUhrzeit(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-dark-surface flex items-end justify-between px-14 pb-8 shrink-0" style={{ height: "220px" }}>
        <div>
          <p className="text-white text-[24px] font-medium">Haltestelle</p>
          <p className="text-white text-[96px] font-bold leading-none">Lager A</p>
        </div>
        <p className="text-white text-[96px] font-normal tabular-nums">{uhrzeit}</p>
      </div>

      {/* Spalten-Header */}
      <div className="bg-[#646A79] h-18 flex items-center px-14 text-white text-[28px] font-semibold shrink-0">
        <span className="w-53.5">Linie</span>
        <span className="flex-1">Richtung</span>
        <span className="w-75 text-right">Abfahrt</span>
      </div>

      {/* Abfahrts-Reihen */}
      <div className="flex-1">
        {MOCK_ABFAHRTEN.map((abfahrt) => (
          <div
            key={abfahrt.id}
            className="flex items-center px-14 border-b border-gray-300 bg-[#E6E6E6]"
            style={{ height: "198px" }}
          >
            {/* Linie */}
            <div className="w-53.5 shrink-0 flex items-center">
              <BusIcon />
            </div>

            {/* Richtung */}
            <div className="flex-1">
              <p className="text-black font-bold text-[54px] leading-tight">{abfahrt.richtung}</p>
              <p className="text-dark-surface font-medium text-[34px] leading-tight">{abfahrt.via}</p>
              {abfahrt.hinweis && (
                <p className="text-black font-medium text-[28px] mt-1">{abfahrt.hinweis}</p>
              )}
            </div>

            {/* Abfahrt */}
            <div className="w-75 text-right shrink-0">
              <p className="text-black text-[54px] font-medium leading-tight">{abfahrt.abfahrt}</p>
              {abfahrt.verspaetung && (
                <p className="text-dark-surface text-[32px] font-medium">{abfahrt.verspaetung}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
