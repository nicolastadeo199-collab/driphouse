"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  productName,
}: {
  images: { url: string }[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-border bg-background-elevated text-muted">
        Sin fotos
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label="Ampliar foto"
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-black"
      >
        <Image
          src={images[active].url}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border ${
                index === active ? "border-accent" : "border-border"
              }`}
            >
              <Image src={image.url} alt={`${productName} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-[90vh] w-[min(90vw,900px)] rounded-lg border border-border bg-background p-0 backdrop:bg-black/85"
      >
        <div className="relative flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm text-muted">{productName}</span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:text-accent"
          >
            ✕
          </button>
        </div>
        <div className="relative aspect-square w-full">
          <Image
            src={images[active].url}
            alt={productName}
            fill
            sizes="90vw"
            className="object-contain"
          />
        </div>
      </dialog>
    </div>
  );
}
