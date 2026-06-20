export function PlusIcon({ color = "#146AA1" }: { color?: string } = {}) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
