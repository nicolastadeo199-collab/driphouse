import type { BadgeVariant } from "@/components/ui/Badge";

const NEW_WINDOW_DAYS = 14;
const LOW_STOCK_THRESHOLD = 3;

type BadgeInput = {
  status: string;
  availability: string;
  createdAt: Date | string;
  variants: { stock: number }[];
};

export function getProductBadge(product: BadgeInput): BadgeVariant | null {
  if (product.status === "SOLD_OUT") return "agotado";

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  if (product.availability === "IN_STOCK" && totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD) {
    return "ultimas-unidades";
  }

  const createdAt = new Date(product.createdAt);
  const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated <= NEW_WINDOW_DAYS) return "nuevo";

  if (product.availability === "MADE_TO_ORDER") return "encargo";

  return null;
}

export function totalStock(variants: { stock: number }[]) {
  return variants.reduce((sum, v) => sum + v.stock, 0);
}
