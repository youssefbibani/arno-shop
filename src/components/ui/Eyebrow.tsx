import clsx from "clsx";

export default function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <div className={clsx("eyebrow flex items-center gap-2.5", className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-rust" />}
      {children}
    </div>
  );
}
