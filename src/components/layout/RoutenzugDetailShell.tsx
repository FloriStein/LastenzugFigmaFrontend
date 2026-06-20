interface RoutenzugDetailShellProps {
  titelleiste: React.ReactNode;
  kameraPanel: React.ReactNode;
  fahrtInfoPanel: React.ReactNode;
  aktionenPanel: React.ReactNode;
}

export function RoutenzugDetailShell({
  titelleiste,
  kameraPanel,
  fahrtInfoPanel,
  aktionenPanel,
}: RoutenzugDetailShellProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {titelleiste}
      <div className="grid grid-cols-3 flex-1 overflow-hidden bg-[#1E2229]">
        <div className="overflow-auto p-4">{kameraPanel}</div>
        <div className="overflow-auto p-4 border-x border-[#4A4F5B]">{fahrtInfoPanel}</div>
        <div className="overflow-auto p-4">{aktionenPanel}</div>
      </div>
    </div>
  );
}
