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

const GESAMT = NACH_ART.reduce((s, e) => s + e.value, 0);

function Panel({ title, children, headerRight }: { title: string; children: React.ReactNode; headerRight?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[10px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold">{title}</h2>
        {headerRight}
      </div>
      {children}
    </div>
  );
}

export default function StatistikenPage() {
  const [zeitraum, setZeitraum] = useState("10");

  return (
    <main className="px-14 pt-16 pb-16 flex flex-col gap-6">
      <h1 className="text-[42px] font-bold">Statistiken</h1>

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
