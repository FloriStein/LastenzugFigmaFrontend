interface TimelineSchritt {
  label: string;
  zeit: string;
  aktuell?: boolean;
}

interface LieferungTimelineProps {
  schritte: TimelineSchritt[];
}

export function LieferungTimeline({ schritte }: LieferungTimelineProps) {
  const aktuellerIndex = schritte.findIndex((s) => s.aktuell);

  return (
    <ol className="relative flex flex-col gap-0">
      {schritte.map((schritt, i) => {
        const isPast = aktuellerIndex !== -1 ? i < aktuellerIndex : false;
        const isCurrent = schritt.aktuell;

        return (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full shrink-0 mt-0.5 ${
                  isCurrent
                    ? "bg-blue-primary"
                    : isPast
                    ? "bg-gray-muted"
                    : "bg-white border-2 border-gray-muted"
                }`}
              />
              {i < schritte.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-8 ${isPast ? "bg-gray-muted" : "bg-[#E0E0E0]"}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-[15px] font-medium ${isCurrent ? "text-blue-primary" : "text-dark-surface"}`}>
                {schritt.label}
              </p>
              {schritt.zeit && (
                <p className="text-[13px] text-[#646A79]">{schritt.zeit}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
