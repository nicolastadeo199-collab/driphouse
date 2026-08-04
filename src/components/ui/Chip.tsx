export default function Chip({
  active,
  children,
  ...rest
}: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-accent-ink"
          : "border-border text-muted hover:border-accent hover:text-accent"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}
