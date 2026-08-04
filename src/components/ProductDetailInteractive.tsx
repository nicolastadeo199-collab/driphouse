"use client";

import { useEffect, useRef, useState } from "react";
import ContactButtons from "@/components/ContactButtons";
import Modal from "@/components/ui/Modal";

type Variant = { size: string; stock: number };

export default function ProductDetailInteractive({
  productName,
  variants,
  sizeGuideNote,
}: {
  productName: string;
  variants: Variant[];
  sizeGuideNote?: string | null;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const inlineCtaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = inlineCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {variants.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-muted">Talles disponibles</p>
            {sizeGuideNote && (
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="text-xs font-medium text-accent hover:underline"
              >
                Ver guía de talles
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Elegir talle">
            {variants.map((v) => {
              const outOfStock = v.stock <= 0;
              const lowStock = !outOfStock && v.stock <= 3;
              const selected = selectedSize === v.size;
              return (
                <button
                  key={v.size}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={outOfStock}
                  onClick={() => setSelectedSize(v.size)}
                  className={`rounded border px-3 py-1.5 text-sm transition-colors ${
                    outOfStock
                      ? "cursor-not-allowed border-border text-muted line-through"
                      : selected
                        ? "border-accent bg-accent text-accent-ink"
                        : lowStock
                          ? "border-warning text-warning hover:bg-warning/10"
                          : "border-border text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div ref={inlineCtaRef} className="mt-8">
        <ContactButtons productName={productName} size={selectedSize} />
      </div>

      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
          <ContactButtons productName={productName} size={selectedSize} />
        </div>
      )}

      {sizeGuideNote && (
        <Modal open={guideOpen} onClose={() => setGuideOpen(false)} title="Guía de talles">
          <p className="text-sm leading-relaxed text-foreground">{sizeGuideNote}</p>
        </Modal>
      )}
    </div>
  );
}
