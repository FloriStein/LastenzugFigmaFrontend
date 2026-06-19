interface KarteIconProps {
  variant: "routenzug" | "routenzug-selected" | "routenzug-problem" | "rsu" | "kamera";
}

export function KarteIcon({ variant }: KarteIconProps) {
  if (variant === "routenzug" || variant === "routenzug-selected" || variant === "routenzug-problem") {
    const color =
      variant === "routenzug-selected"
        ? "#146AA1"
        : variant === "routenzug-problem"
          ? "#C55141"
          : "#2A2F3B";

    return (
      <svg width="28" height="31" viewBox="0 0 28 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="12" r="10" fill={color} />
        <polygon points="14,31 6,18 22,18" fill={color} />
      </svg>
    );
  }

  if (variant === "rsu") {
    return (
      <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="16" width="24" height="20" rx="2" fill="#2A2F3B" />
        <line x1="18" y1="16" x2="18" y2="4" stroke="#2A2F3B" strokeWidth="2" />
        <line x1="12" y1="8" x2="18" y2="4" stroke="#2A2F3B" strokeWidth="2" />
        <line x1="24" y1="8" x2="18" y2="4" stroke="#2A2F3B" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="28" height="24" rx="3" fill="#2A2F3B" />
      <circle cx="18" cy="20" r="8" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="18" cy="20" r="3" fill="#FFFFFF" />
    </svg>
  );
}
