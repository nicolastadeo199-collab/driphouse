import slugify from "slugify";
import { prisma } from "@/lib/prisma";

export async function uniqueProductSlug(name: string, excludeId?: string) {
  const base = slugify(name, { lower: true, strict: true }) || "producto";
  let slug = base;
  let counter = 2;

  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function uniqueCategorySlug(name: string, excludeId?: string) {
  const base = slugify(name, { lower: true, strict: true }) || "categoria";
  let slug = base;
  let counter = 2;

  while (
    await prisma.category.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}
