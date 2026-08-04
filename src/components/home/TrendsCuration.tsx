import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

type TrendBlock = { title: string; href: string; image?: string };

export default function TrendsCuration({ blocks }: { blocks: TrendBlock[] }) {
  if (blocks.length === 0) return null;

  return (
    <section className="border-b border-border bg-background-elevated py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Curaduría" title="Tendencias" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {blocks.map((block) => (
            <Link
              key={block.title}
              href={block.href}
              className="group relative block aspect-[3/4] overflow-hidden rounded-lg border border-border bg-black"
            >
              {block.image ? (
                <Image
                  src={block.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-muted">
                  Sin foto
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-4 pt-10 text-sm font-bold uppercase tracking-wide text-white group-hover:text-accent">
                {block.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
