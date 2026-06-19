interface ConnectionIconProps {
  status: "connected" | "disconnected";
  className?: string;
}

export function ConnectionIcon({ status, className }: ConnectionIconProps) {
  const isConnected = status === "connected";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="0"  y="16" width="5" height="8"  rx="1" opacity={isConnected ? "1" : "0.3"} />
      <rect x="9"  y="10" width="5" height="14" rx="1" opacity={isConnected ? "1" : "0.3"} />
      <rect x="18" y="4"  width="5" height="20" rx="1" opacity={isConnected ? "1" : "0.3"} />
      {!isConnected && (
        <line x1="0" y1="24" x2="24" y2="0" stroke="#C55141" strokeWidth="2" />
      )}
    </svg>
  );
}
