import { cn } from "@/lib/utils";

interface FahrzeugAktionCardProps {
  label: string;
  icon: React.ReactNode;
  variant: "danger" | "warning";
  onClick: () => void;
}

export function FahrzeugAktionCard({ label, icon, variant, onClick }: FahrzeugAktionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[10px] p-4 w-full h-[80px]",
        variant === "danger"
          ? "bg-[#C55141]/20 text-[#C55141]"
          : "bg-[#DDB411]/20 text-[#DDB411]"
      )}
    >
      {icon}
      <span className="text-[13px] font-medium">{label}</span>
    </button>
  );
}
