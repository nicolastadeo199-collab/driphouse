import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-graffiti text-3xl leading-none tracking-wide text-accent text-glow ${className}`}
    >
      Drip<span className="text-foreground">House</span>
    </Link>
  );
}
