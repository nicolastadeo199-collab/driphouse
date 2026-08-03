import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function getUploadDir() {
  return path.resolve(
    process.cwd(),
    /* turbopackIgnore: true */ process.env.UPLOAD_DIR ?? "./public/uploads"
  );
}

export async function saveUploadedImage(file: File): Promise<string> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error(`Tipo de archivo no soportado: ${file.type || "desconocido"}`);
  }

  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/${filename}`;
}

export async function deleteUploadedImage(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const filename = url.replace("/uploads/", "");
  if (filename.includes("..") || filename.includes("/")) return;

  try {
    await unlink(path.join(getUploadDir(), filename));
  } catch {
    // El archivo puede no existir; no es un error critico.
  }
}
