interface DetailShellProps {
  children: React.ReactNode;
  titelleiste: React.ReactNode;
}

export function DetailShell({ children, titelleiste }: DetailShellProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {titelleiste}
      <div className="flex-1 bg-[#F5F5F5] overflow-auto">
        {children}
      </div>
    </div>
  );
}
