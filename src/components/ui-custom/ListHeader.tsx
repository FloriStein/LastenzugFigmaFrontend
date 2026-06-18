interface ListHeaderProps {
  title: string;
}

export function ListHeader({ title }: ListHeaderProps) {
  // TODO: ListHeader — Figma Component Set #65:489
  return <h4 className="font-semibold text-[15px]">{title}</h4>;
}
