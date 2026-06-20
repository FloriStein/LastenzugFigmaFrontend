interface BeschleunigungsanzeigeProps {
  value: number; // 0–6
}

const BARS = [
  { x: 0,  y: 20, h: 4,  fill: "#51A135" },
  { x: 11, y: 16, h: 8,  fill: "#51A135" },
  { x: 22, y: 12, h: 12, fill: "#DDB411" },
  { x: 33, y: 8,  h: 16, fill: "#DDB411" },
  { x: 44, y: 4,  h: 20, fill: "#C55141" },
  { x: 55, y: 0,  h: 24, fill: "#C55141" },
] as const;

export function Beschleunigungsanzeige({ value }: BeschleunigungsanzeigeProps) {
  return (
    <svg width="66" height="24" viewBox="0 0 66 24" fill="none">
      {BARS.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={bar.y}
          width="8"
          height={bar.h}
          rx="1"
          fill={bar.fill}
          opacity={i < value ? "1" : "0.25"}
        />
      ))}
    </svg>
  );
}
