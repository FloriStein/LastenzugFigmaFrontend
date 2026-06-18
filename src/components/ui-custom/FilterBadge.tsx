interface FilterBadgeProps {
  label: string;
  onRemove?: () => void;
}

export function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  // TODO: FilterBadge — Figma Component Set #88:920
  return (
    <span className="bg-filter-badge px-2 py-1 text-sm rounded-sm">
      {label}
      {onRemove && <button onClick={onRemove} className="ml-1">×</button>}
    </span>
  );
}
