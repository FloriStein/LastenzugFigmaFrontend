import Link from "next/link";
import { ConnectionIcon } from "@/components/ui-custom/ConnectionIcon";

interface EreignisTitelleisteProps {
  title: string;
  connectionStatus: "connected" | "disconnected";
  backHref?: string;
  onAbschließen?: () => void;
  onTrennen?: () => void;
}

export function EreignisTitelleiste({
  title,
  connectionStatus,
  backHref,
  onAbschließen,
  onTrennen,
}: EreignisTitelleisteProps) {
  return (
    <div className="flex items-center px-8 w-full h-[148px] bg-[#146AA1]">
      {backHref && (
        <Link href={backHref} className="text-white text-[18px] mr-8">
          ← Zurück
        </Link>
      )}
      <span className="text-white text-[28px] font-bold flex-1">{title}</span>
      <ConnectionIcon status={connectionStatus} className="text-white mr-6" />
      {onAbschließen && (
        <button
          onClick={onAbschließen}
          className="border border-white text-white px-6 py-2 rounded-[6px] text-[16px] font-medium mr-3"
        >
          Abschließen
        </button>
      )}
      {onTrennen && (
        <button
          onClick={onTrennen}
          className="border border-white text-white px-6 py-2 rounded-[6px] text-[16px] font-medium"
        >
          Trennen
        </button>
      )}
    </div>
  );
}
