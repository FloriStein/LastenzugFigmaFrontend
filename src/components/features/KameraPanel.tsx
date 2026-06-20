import { ConnectionIcon } from "@/components/ui-custom/ConnectionIcon";
import { Beschleunigungsanzeige } from "@/components/ui-custom/Beschleunigungsanzeige";

interface KameraPanelProps {
  frontImageUrl: string;
  sideImageUrl?: string;
  speedKmh: number;
  acceleration: number;
  connectionStatus?: "connected" | "disconnected";
}

export function KameraPanel({
  frontImageUrl,
  sideImageUrl,
  speedKmh,
  acceleration,
  connectionStatus = "connected",
}: KameraPanelProps) {
  return (
    <div className="relative bg-black rounded-[10px] overflow-hidden">
      <img alt="Kamera Vorne" src={frontImageUrl} className="w-full aspect-video object-cover" />

      <div className="absolute bottom-3 left-3 flex items-end gap-1">
        <span className="text-white text-[32px] font-bold leading-none">{speedKmh}</span>
        <span className="text-gray-muted text-[16px] pb-1">km/h</span>
      </div>

      <div className="absolute top-3 right-3">
        <ConnectionIcon status={connectionStatus} className="text-white" />
      </div>

      <div className="absolute bottom-3 right-3">
        <Beschleunigungsanzeige value={acceleration} />
      </div>

      {sideImageUrl && (
        <img alt="Kamera Seite" src={sideImageUrl} className="w-full h-[120px] object-cover mt-1" />
      )}
    </div>
  );
}
