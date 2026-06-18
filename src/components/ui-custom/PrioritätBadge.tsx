interface PrioritätBadgeProps {
  prio: 0 | 1 | 2 | 3 | 4;
  color?: "dark" | "blue";
}

export function PrioritätBadge({ prio, color = "dark" }: PrioritätBadgeProps) {
  const fillColor = color === "blue" ? "#146AA1" : "#2A2F3B";

  return (
    <svg width="80" height="14" viewBox="0 0 80 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      {([0, 1, 2, 3] as const).map((i) =>
        i < prio ? (
          <circle key={i} cx={7 + i * 22} cy={7} r={7} fill={fillColor} />
        ) : (
          <circle key={i} cx={7 + i * 22} cy={7} r={6.5} fill="none" stroke={fillColor} strokeWidth={1} />
        )
      )}
    </svg>
  );
}
