"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type ExistingImage = { id: string; url: string };

export default function ImageDropzone({
  existingImages = [],
}: {
  existingImages?: ExistingImage[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function syncInputFiles(nextFiles: File[]) {
    const dataTransfer = new DataTransfer();
    nextFiles.forEach((file) => dataTransfer.items.add(file));
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
    setFiles(nextFiles);
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    syncInputFiles([...files, ...newFiles]);
  }

  function removeStagedFile(index: number) {
    syncInputFiles(files.filter((_, i) => i !== index));
  }

  function toggleRemoveExisting(id: string) {
    setRemovedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const visibleExisting = existingImages.filter((img) => !removedIds.includes(img.id));

  return (
    <div>
      {removedIds.map((id) => (
        <input key={id} type="hidden" name="removeImageIds" value={id} />
      ))}

      <input
        ref={inputRef}
        type="file"
        name="images"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-lg border-2 border-dashed px-4 py-8 text-center text-sm transition-colors ${
          dragOver ? "border-accent bg-accent/10" : "border-border text-muted hover:border-accent"
        }`}
      >
        Arrastra fotos aca o hace click para elegirlas
      </div>

      {(visibleExisting.length > 0 || files.length > 0) && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {visibleExisting.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded border border-border">
              <Image src={img.url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => toggleRemoveExisting(img.id)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-xs text-white"
                aria-label="Quitar imagen"
              >
                ✕
              </button>
            </div>
          ))}

          {files.map((file, index) => (
            <StagedPreview key={index} file={file} onRemove={() => removeStagedFile(index)} />
          ))}
        </div>
      )}
    </div>
  );
}

function StagedPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url] = useState(() => URL.createObjectURL(file));

  return (
    <div className="group relative aspect-square overflow-hidden rounded border border-accent/60">
      <Image src={url} alt={file.name} fill className="object-cover" unoptimized />
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-xs text-white"
        aria-label="Quitar imagen"
      >
        ✕
      </button>
    </div>
  );
}
