"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FahrtmodusCard } from "@/components/features/FahrtmodusCard";
import { FahrzeugAktionCard } from "@/components/features/FahrzeugAktionCard";
import { KommunikationPanel } from "@/components/features/KommunikationPanel";
import type { FahrtmodusVariant } from "@/types/fahrtmodus";

type Tab = "fahrt" | "fahrzeug" | "kommunikation";
type KommState = "idle" | "eingehend" | "aktiv";

interface AktionenPanelProps {
  fahrtmodus: FahrtmodusVariant;
  onFahrtmodusAction?: () => void;
}

function NothaltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" fill="currentColor" />
    </svg>
  );
}

function LangsamIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const BASE_TABS: { id: Tab; baseLabel: string }[] = [
  { id: "fahrt", baseLabel: "Fahrt" },
  { id: "fahrzeug", baseLabel: "Fahrzeug" },
  { id: "kommunikation", baseLabel: "Kommunikation" },
];

export function AktionenPanel({ fahrtmodus, onFahrtmodusAction }: AktionenPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("fahrt");
  const [kommState, setKommState] = useState<KommState>("idle");

  return (
    <div className="bg-dark-surface rounded-[10px] p-4 flex flex-col gap-4">
      <div className="flex gap-6 border-b border-[#4A4F5B]">
        {BASE_TABS.map((tab) => {
          const label =
            tab.id === "kommunikation" && kommState !== "idle"
              ? "Kommunikation (1)"
              : tab.baseLabel;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-2 text-[14px] font-medium",
                activeTab === tab.id
                  ? "text-white border-b-2 border-blue-primary"
                  : "text-gray-muted"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "fahrt" && (
        <FahrtmodusCard variant={fahrtmodus} onPrimaryAction={onFahrtmodusAction} />
      )}

      {activeTab === "fahrzeug" && (
        <div className="flex flex-col gap-3">
          <FahrzeugAktionCard
            label="Nothalt"
            icon={<NothaltIcon />}
            variant="danger"
            onClick={() => {}}
          />
          <FahrzeugAktionCard
            label="Langsam fahren"
            icon={<LangsamIcon />}
            variant="warning"
            onClick={() => {}}
          />
        </div>
      )}

      {activeTab === "kommunikation" && (
        <KommunikationPanel onStateChange={setKommState} />
      )}
    </div>
  );
}
