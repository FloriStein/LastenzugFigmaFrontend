interface Abfahrt {
  id: string;
  richtung: string;
  via: string;
  abfahrt: string;
  verspaetung?: string;
  umleitung?: string;
}

const MOCK_UHRZEIT = "11:35";

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
    umleitung: "Haltestelle Halle A entfällt",
  },
  {
    id: "3",
    richtung: "Lager M",
    via: "via Lager H → Hauptgebäude → Lager L",
    abfahrt: "in 3h 9min",
  },
];

export default function AnzeigetafelPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-dark-surface h-55 flex items-end justify-between px-14 pb-8 shrink-0">
        <div>
          <p className="text-white text-[24px] font-medium">Haltestelle</p>
          <p className="text-white text-[96px] font-bold leading-none">Lager A</p>
        </div>
        <p className="text-white text-[96px] font-normal">{MOCK_UHRZEIT}</p>
      </div>

      {/* Spalten-Header */}
      <div className="bg-[#646A79] h-18 flex items-center px-14 text-white text-[28px] font-semibold shrink-0">
        <span className="w-53.5">Linie</span>
        <span className="flex-1">Richtung</span>
        <span className="w-75 text-right">Abfahrt</span>
      </div>

      {/* Abfahrts-Reihen */}
      <div className="bg-[#E6E6E6] flex-1">
        {MOCK_ABFAHRTEN.map((abfahrt) => (
          <div key={abfahrt.id} className="flex items-center h-49.5 px-14 border-b border-gray-300">
            {/* Linie */}
            <div className="w-53.5 shrink-0">
              <div className="w-27.5 h-27.5 bg-gray-300 rounded-full" />
            </div>
            {/* Richtung */}
            <div className="flex-1">
              <p className="text-black font-bold text-[28px]">{abfahrt.richtung}</p>
              <p className="text-dark-surface font-medium text-[34px]">{abfahrt.via}</p>
              {abfahrt.umleitung && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-[rgba(233,119,6,0.8)] text-white text-[28px] font-semibold px-4 py-1 rounded-[10px]">
                    Umleitung
                  </span>
                  <span className="text-black font-medium text-[34px]">{abfahrt.umleitung}</span>
                </div>
              )}
            </div>
            {/* Abfahrt */}
            <div className="w-75 text-right shrink-0">
              <p className="text-black text-[54px] font-medium">{abfahrt.abfahrt}</p>
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
