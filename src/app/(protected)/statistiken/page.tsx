"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/lib/useRole";

const EREIGNISAUFKOMMEN = [
  { tag: "Mo", abgeschlossen: 8,  einkommend: 4 },
  { tag: "Di", abgeschlossen: 12, einkommend: 6 },
  { tag: "Mi", abgeschlossen: 7,  einkommend: 3 },
  { tag: "Do", abgeschlossen: 10, einkommend: 5 },
  { tag: "Fr", abgeschlossen: 14, einkommend: 8 },
  { tag: "Sa", abgeschlossen: 11, einkommend: 5 },
  { tag: "So", abgeschlossen: 16, einkommend: 6 },
  { tag: "Mo", abgeschlossen: 9,  einkommend: 4 },
  { tag: "Di", abgeschlossen: 13, einkommend: 7 },
  { tag: "Mi", abgeschlossen: 10, einkommend: 5 },
];

const NACH_ART = [
  { name: "Strecke blockiert",         value: 23, color: "#146AA1" },
  { name: "Weiterfahrt",               value: 16, color: "#22c55e" },
  { name: "Sensordefekt",              value: 12, color: "#f59e0b" },
  { name: "Kommunikationsanfrage",     value: 12, color: "#8b5cf6" },
  { name: "Verlassen Betriebsgelände", value: 5,  color: "#ef4444" },
];

const NACH_ROUTENZUG = [
  { name: "Routenzug A", abgeschlossen: 18, einkommend: 9 },
  { name: "Routenzug B", abgeschlossen: 14, einkommend: 6 },
  { name: "Routenzug C", abgeschlossen: 10, einkommend: 5 },
  { name: "Routenzug D", abgeschlossen: 8,  einkommend: 3 },
];

const BEARBEITETE_AUFTRAEGE = [
  { tag: "Mo", auftraege: 8  },
  { tag: "Di", auftraege: 12 },
  { tag: "Mi", auftraege: 7  },
  { tag: "Do", auftraege: 10 },
  { tag: "Fr", auftraege: 14 },
  { tag: "Sa", auftraege: 11 },
  { tag: "So", auftraege: 16 },
];

const GAST_KPIS = [
  { wert: "3 min 20s", label: "schnellere Lieferung von Aufträgen"              },
  { wert: "+13",       label: "bearbeitete Aufträge am Tag"                     },
  { wert: "20%",       label: "geringeres innerbetriebliches Verkehrsaufkommen" },
];

const GESAMT = NACH_ART.reduce((s, e) => s + e.value, 0);

function Panel({ title, children, headerRight }: { title: string; children: React.ReactNode; headerRight?: React.ReactNode }) {
  return (
    <div className="bg-background rounded-[10px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold">{title}</h2>
        {headerRight}
      </div>
      {children}
    </div>
  );
}

function KpiCard({ wert, label }: { wert: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 flex-1">
      <div className="w-16.75 h-16.75 bg-blue-primary rounded-full flex items-center justify-center shrink-0">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
          <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2.5" fill="none" />
          <path d="M16 10v6l4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-[24px] font-bold text-black">{wert}</span>
      <span className="text-[18px] text-center text-black leading-snug">{label}</span>
    </div>
  );
}

function LiveansichtPlaceholder() {
  return (
    <div className="relative w-full h-full bg-[#E3EBE3] rounded-[10px] overflow-hidden">
      <div className="absolute" style={{ left: "20%", top: "20%", width: "15%", height: "12%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "45%", top: "25%", width: "20%", height: "15%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "65%", top: "18%", width: "12%", height: "18%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "15%", top: "55%", width: "18%", height: "14%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "45%", top: "60%", width: "22%", height: "12%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 25 48 L 44 48 L 55 35 L 66 35" stroke="#146AA1" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
        <path d="M 66 60 L 55 60 L 44 48" stroke="#146AA1" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
      </svg>
      <div
        className="absolute flex items-center justify-center text-white text-[12px] font-bold bg-blue-primary rounded-full"
        style={{ left: "30%", top: "44%", width: "28px", height: "28px", transform: "translate(-50%,-50%)" }}
      >
        A
      </div>
      <div
        className="absolute flex items-center justify-center text-white text-[12px] font-bold bg-blue-primary rounded-full"
        style={{ left: "58%", top: "57%", width: "28px", height: "28px", transform: "translate(-50%,-50%)" }}
      >
        B
      </div>
      <span className="absolute text-[10px] font-semibold text-dark-surface opacity-70"
        style={{ left: "21%", top: "34%" }}>Lager A</span>
      <span className="absolute text-[10px] font-semibold text-dark-surface opacity-70"
        style={{ left: "47%", top: "23%" }}>Hauptgebäude</span>
      <span className="absolute text-[10px] font-semibold text-dark-surface opacity-70"
        style={{ left: "16%", top: "53%" }}>Lager H</span>
      <span className="absolute text-[10px] font-semibold text-dark-surface opacity-70"
        style={{ left: "46%", top: "58%" }}>Halle A</span>
    </div>
  );
}

function GastStatistikenView() {
  return (
    <main className="px-14 pt-16 pb-16">
      <h1 className="text-[48px] font-bold mb-8">Automatisierte Routenzüge im Einsatz</h1>

      <div className="flex gap-6" style={{ minHeight: "867px" }}>
        {/* Linkes Panel: Liveansicht */}
        <div className="flex-1 bg-[#F2F2F2] rounded-[10px] p-6 flex flex-col">
          <h2 className="text-[32px] font-bold mb-4">Liveansicht Betriebsgelände</h2>
          <div className="flex-1">
            <LiveansichtPlaceholder />
          </div>
        </div>

        {/* Rechte Spalte */}
        <div className="flex flex-col gap-6 shrink-0" style={{ width: "770px" }}>
          {/* Bearbeitete Aufträge */}
          <div className="bg-[#F2F2F2] rounded-[10px] p-6 flex-1">
            <h2 className="text-[32px] font-bold mb-4">Bearbeitete Aufträge</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={BEARBEITETE_AUFTRAEGE}>
                <XAxis dataKey="tag" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="auftraege"
                  stroke="#E97706"
                  fill="#E97706"
                  fillOpacity={0.23}
                  name="Aufträge"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vorteile */}
          <div className="bg-[#F2F2F2] rounded-[10px] p-6">
            <h2 className="text-[32px] font-bold mb-6">Vorteile</h2>
            <div className="flex gap-6 justify-around">
              {GAST_KPIS.map((kpi) => (
                <KpiCard key={kpi.wert} wert={kpi.wert} label={kpi.label} />
              ))}
            </div>
            <p className="text-[16px] text-[#515358] mt-6 text-center">
              im Vergleich zum herkömmlichen Einsatz von Gabelstaplern
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StatistikenPage() {
  const [zeitraum, setZeitraum] = useState("10");
  const role = useRole();
  const isSL = role === "schichtleitung";
  const [filterArt, setFilterArt] = useState<string | null>("Strecke blockiert");

  if (role === "gast") {
    return <GastStatistikenView />;
  }

  return (
    <main className="px-14 pt-16 pb-16 flex flex-col gap-6">
      <h1 className="text-[42px] font-bold">Statistiken</h1>

      {isSL && (
        <div className="flex items-center gap-3">
          {filterArt && (
            <div className="flex items-center gap-2 bg-[#4EA7DF] text-white rounded px-3 py-1.5">
              <span className="text-[18px] font-medium">Art: {filterArt}</span>
              <button
                onClick={() => setFilterArt(null)}
                className="text-white/80 hover:text-white text-[20px] leading-none"
                aria-label="Filter entfernen"
              >
                ×
              </button>
            </div>
          )}
          <button className="flex items-center gap-2 bg-[rgba(20,106,161,0.1)] text-blue-primary rounded px-3 py-1.5 text-[18px] font-semibold hover:bg-[rgba(20,106,161,0.15)] transition-colors">
            neuer Filter
          </button>
        </div>
      )}

      {/* Panel 1 — Ereignisaufkommen */}
      <Panel
        title="Ereignisaufkommen"
        headerRight={
          <Select value={zeitraum} onValueChange={(v) => v !== null && setZeitraum(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 Tage</SelectItem>
              <SelectItem value="30">30 Tage</SelectItem>
              <SelectItem value="90">90 Tage</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={EREIGNISAUFKOMMEN}>
            <XAxis dataKey="tag" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="abgeschlossen" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
            <Area type="monotone" dataKey="einkommend"    stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      {/* Zweite Zeile */}
      <div className="flex gap-6">
        {/* Panel 2 — Nach Ereignisart */}
        <Panel title="Nach Ereignisart">
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={NACH_ART}
                  dataKey="value"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                >
                  {NACH_ART.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[28px] font-bold text-dark-surface pointer-events-none">
              {GESAMT}
            </span>
          </div>
        </Panel>

        {/* Panel 3 — Betroffener Routenzug */}
        <Panel title="Betroffener Routenzug">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={NACH_ROUTENZUG}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="abgeschlossen" fill="#22c55e" />
              <Bar dataKey="einkommend"    fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Panel 4 — Nach Ort */}
      <Panel title="Nach Ort">
        <div className="relative bg-gray-200 rounded-[10px] h-65 flex items-center justify-around px-16">
          <div className="flex flex-col items-center gap-2">
            <span className="w-14 h-14 rounded-full bg-blue-primary flex items-center justify-center text-white text-[20px] font-bold">8</span>
            <span className="text-[13px] text-[#646A79]">Position links</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="w-14 h-14 rounded-full bg-blue-primary flex items-center justify-center text-white text-[20px] font-bold">22</span>
            <span className="text-[13px] text-[#646A79]">Position mitte</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="w-14 h-14 rounded-full bg-blue-primary flex items-center justify-center text-white text-[20px] font-bold">1</span>
            <span className="text-[13px] text-[#646A79]">Position rechts</span>
          </div>
        </div>
      </Panel>
    </main>
  );
}
