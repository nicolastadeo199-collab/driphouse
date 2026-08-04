export default function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`mb-6 ${className}`}>
      {eyebrow && (
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted">{eyebrow}</p>
      )}
      <h2 className="font-graffiti text-2xl text-accent sm:text-3xl">{title}</h2>
    </div>
  );
}
