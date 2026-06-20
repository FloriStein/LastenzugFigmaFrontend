interface AuftragAktionsleistenProps {
  onBearbeiten: () => void;
  onStornieren: () => void;
}

export function AuftragAktionsleiste({ onBearbeiten, onStornieren }: AuftragAktionsleistenProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-[10px] px-6 py-4"
      style={{ background: "rgba(158, 172, 182, 0.1)" }}
    >
      <button
        onClick={onBearbeiten}
        className="bg-blue-primary text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-blue-primary/80 transition-colors"
      >
        Auftrag bearbeiten
      </button>
      <button
        onClick={onStornieren}
        className="bg-red-600 text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-red-600/80 transition-colors"
      >
        Auftrag stornieren
      </button>
    </div>
  );
}
