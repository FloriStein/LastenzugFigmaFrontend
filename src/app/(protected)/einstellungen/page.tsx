"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[10px] p-6 flex flex-col gap-6">
      <h2 className="text-[20px] font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function ToggleRow({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[15px] text-dark-surface">{label}</span>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-48 text-[15px] text-dark-surface shrink-0">{label}</span>
      <Slider
        value={[value]}
        onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
        min={0}
        max={100}
        className="flex-1"
      />
      <span className="w-8 text-right text-[15px] text-[#646A79]">{value}</span>
    </div>
  );
}

const KÜRZEL_GRUPPEN = [
  {
    titel: "Ereignisbearbeitung",
    items: [
      { key: "n", desc: "Nächste Ansicht" },
      { key: "b", desc: "Vorherige Ansicht" },
      { key: "f", desc: "Filter" },
      { key: "m", desc: "Karte" },
      { key: "v", desc: "Linienübersicht" },
      { key: "z", desc: "Routenzüge" },
      { key: "u", desc: "RSUs" },
      { key: "k", desc: "Kameras" },
      { key: "l", desc: "Ladestationen" },
    ],
  },
  {
    titel: "Kamera",
    items: [
      { key: "←", desc: "Vorn" },
      { key: "→", desc: "Links / Rechts" },
      { key: "↑", desc: "Hinten" },
      { key: "r", desc: "Zoom zurücksetzen" },
    ],
  },
  {
    titel: "Informationen",
    items: [
      { key: "q", desc: "Fahrzeuginformationen" },
      { key: "w", desc: "Betriebsstatus" },
    ],
  },
  {
    titel: "Aktionen",
    items: [
      { key: "a", desc: "Fahrzeug" },
      { key: "s", desc: "Fahrt" },
      { key: "d", desc: "Kommunikation" },
    ],
  },
];

export default function EinstellungenPage() {
  const [lautstärke, setLautstärke] = useState(48);
  const [benachrichtigungen, setBenachrichtigungen] = useState(40);
  const [fahrgastkommunikation, setFahrgastkommunikation] = useState(60);
  const [fahrzeug, setFahrzeug] = useState(50);

  return (
    <main className="px-14 pt-16 pb-16 flex flex-col gap-6">
      <h1 className="text-[42px] font-bold">Einstellungen</h1>

      <div className="flex gap-6">
        {/* Linkes Panel — Programm */}
        <Panel title="Programm">
          <div className="flex flex-col gap-5">
            <h3 className="text-[16px] font-semibold text-[#646A79] uppercase tracking-wide">Hilfen</h3>
            <ToggleRow label="Erweiterte Erklärungen für Bedienelemente" />
            <ToggleRow label="Hinweise zu Tastaturkürzeln" />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-[#646A79] uppercase tracking-wide">Aussehen</h3>
            <div className="flex items-center gap-4">
              <span className="text-[15px] text-dark-surface">Theme</span>
              <Select defaultValue="hell">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hell">Hell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-[#646A79] uppercase tracking-wide">Trainingsmodus</h3>
            <p className="text-[14px] text-[#646A79]">
              Im Trainingsmodus können Sie alle Funktionen gefahrlos testen, ohne dass echte Fahrzeuge oder Aufträge beeinflusst werden.
            </p>
            <button className="self-start border border-dark-surface rounded-[8px] px-4 py-2 text-[15px] font-medium hover:bg-gray-50 transition-colors">
              Trainingsmodus
            </button>
          </div>
        </Panel>

        {/* Rechtes Panel — Tastaturkürzel */}
        <Panel title="Tastaturkürzel">
          <table className="w-full text-[14px] border-collapse">
            <tbody>
              {KÜRZEL_GRUPPEN.map((gruppe) => (
                <>
                  <tr key={gruppe.titel}>
                    <td colSpan={2} className="pt-4 pb-1 font-semibold text-[15px] text-dark-surface">
                      {gruppe.titel}
                    </td>
                  </tr>
                  {gruppe.items.map((item) => (
                    <tr key={item.key + item.desc}>
                      <td className="pr-4 py-0.5 w-10">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm">{item.key}</span>
                      </td>
                      <td className="py-0.5 text-[#646A79]">{item.desc}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Unteres Panel — Sound */}
      <Panel title="Sound">
        <div className="flex flex-col gap-4">
          <SliderRow label="Lautstärke" value={lautstärke} onChange={setLautstärke} />
          <SliderRow label="Benachrichtigungen" value={benachrichtigungen} onChange={setBenachrichtigungen} />
          <SliderRow label="Fahrgastkommunikation" value={fahrgastkommunikation} onChange={setFahrgastkommunikation} />
          <SliderRow label="Fahrzeug" value={fahrzeug} onChange={setFahrzeug} />
        </div>

        <div className="flex gap-6 mt-2">
          <div className="flex flex-col gap-2">
            <span className="text-[14px] text-[#646A79]">Eingabegerät</span>
            <Select defaultValue="mikrofon">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mikrofon">Mikrofon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[14px] text-[#646A79]">Ausgabegerät</span>
            <Select defaultValue="lautsprecher">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lautsprecher">Lautsprecher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Panel>
    </main>
  );
}
